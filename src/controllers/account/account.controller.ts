import { UserService } from './../../services/user/user.service';
import { AuthenticatedGuard } from './../../guards/authenticated.guard';
import { LocalGuard } from './../../guards/local-auth.guard';
import {
  Controller,
  Get,
  Req,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express } from 'express';
import { AccountService } from '../../services/account/account.service';
import { User } from 'src/model/user.model';
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}
  @UseGuards(AuthenticatedGuard)
  @Get('accounts')
  getAccounts(@Req() req: Request): any {
    return this.accountService.getAccounts(req);
  }
  @Post('signup')
  postSignUp(@Req() req: Request) {
    return this.accountService.postSignUp(req);
  }
  @Get(':id')
  getAccount(@Param('id') param) {
    return this.accountService.getAccount(param);
  }
  @Get('user/:username')
  getUser(@Param('username') username: string) {
    return this.accountService.getAccountByName(username);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id/files')
  getFiled(@Req() req: any, @Param('id') param): HttpStatus | object {
    if (req.user.userid !== param) return 403;
    console.log('test');
    return this.accountService.getFiles(param);
  }
  @UseGuards(AuthenticatedGuard)
  @Post(':id/newfile')
  @UseInterceptors(FileInterceptor('file'))
  postNewFile(
    @Req() req: Request | any,
    @Param('id') param,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<HttpStatus> | HttpStatus {
    if (req.user.userid !== param) return 403;
    return this.accountService.postNewFile(file, param, req);
  }
  @UseGuards(AuthenticatedGuard)
  @Post(':id/deletefile')
  async deleteFile(
    @Req() req: any,
    @Param('id') id: string,
    @Body('files') file: string,
  ): Promise<number | string[]> {
    if (req.user.userid !== id) return 403;
    if (!file) return HttpStatus.NO_CONTENT;
    const allFiles = await this.userService.getFilesByUserId(id);
    const foundFile = allFiles.find((e) => e === file);
    if (!foundFile) return HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE;
    return this.userService.deleteFileByUserId(id, file);
  }
}
