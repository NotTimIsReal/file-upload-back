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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express } from 'express';
import { AccountService } from '../../services/account/account.service';
import { User } from 'src/model/user.model';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
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
  @UseGuards(LocalGuard)
  @Get(':id/files')
  getFiled(@Req() req: Request<User>, @Param('id') param): HttpStatus | object {
    console.log('test');
    return {};
  }
  @UseGuards(LocalGuard)
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
}
