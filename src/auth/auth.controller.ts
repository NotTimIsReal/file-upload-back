import { UnAuthenticatedGuard } from '../guards/unauthenticated.guard';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LocalGuard } from '../guards/local-auth.guard';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalGuard)
  @Post('login')
  getLogin(
    @Query('callback') callback: string,
    @Res({
      passthrough: true,
    })
    res: Response,
  ): string | void {
    this.authService.getLogin(callback, res);
    return 'Logged In';
  }
  @UseGuards(AuthenticatedGuard)
  @Get('signout')
  getSignOut(@Req() req: Request) {
    return this.authService.getSignOut(req);
  }
}
