import { LocalGuard } from './../../guards/local-auth.guard';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalGuard)
  @Get('login')
  getLogin(): HttpStatus {
    return this.authService.getLogin();
  }
}
