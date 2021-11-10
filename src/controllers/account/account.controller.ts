import { Controller, Get, Req, HttpStatus, Param, Post } from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from '../../services/account/account.service';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('accounts')
  getAccounts(@Req() req: Request): HttpStatus | object {
    return this.accountService.getAccounts(req);
  }
  @Get(':id')
  getAccount(@Param('id') param) {
    return this.accountService.getAccount(param);
  }
  @Get(':id/files')
  getFiled(@Req() req: Request, @Param('id') param): HttpStatus {
    return 401;
  }
  @Post(':id/newfile')
  postNewFile(@Req() req: Request, @Param('id') param): HttpStatus {
    return 401;
  }
}
