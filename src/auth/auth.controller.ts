import { UnAuthenticatedGuard } from '../guards/unauthenticated.guard';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LocalGuard } from '../guards/local-auth.guard';
import { Controller, Req, UseGuards, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(UnAuthenticatedGuard, LocalGuard)
  @HttpCode(200)
  getLogin(): string {
    return 'LOGGED IN';
  }
  @UseGuards(AuthenticatedGuard)
  @Post('signout')
  getSignOut(@Req() req: Request) {
    return this.authService.getSignOut(req);
  }
}
