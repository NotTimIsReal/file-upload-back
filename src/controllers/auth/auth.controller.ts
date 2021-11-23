import { LocalGuard } from './../../guards/local-auth.guard';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalGuard)
  @Get('login')
  getLogin(
    @Query('callback') callback: string,
    @Res() res: Response,
  ): string | void {
    return this.authService.getLogin(callback, res);
  }
  @Get('signout')
  getSignOut(@Req() req: Request) {
    req.logout();
    req.session.destroy((err) => {
      if (err) return;
    });
    console.log('logout');
    return 200;
  }
}
