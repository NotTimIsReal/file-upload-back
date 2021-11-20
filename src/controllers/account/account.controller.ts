import {
  Controller,
  Get,
  Req,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express } from 'express';
import { AccountService } from '../../services/account/account.service';
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
  @Get(':id/files')
  getFiled(@Req() req: Request, @Param('id') param): HttpStatus | object {
    if (!req.headers.authorization) return HttpStatus.UNAUTHORIZED;
    return {};
  }
  @Post(':id/newfile')
  @UseInterceptors(FileInterceptor('file'))
  postNewFile(
    @Req() req: Request,
    @Param('id') param,
    @UploadedFile() file: Express.Multer.File,
  ): HttpStatus {
    return this.accountService.postNewFile(file, param, req);
  }
}
