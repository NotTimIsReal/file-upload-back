import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'id' });
  }
  async validate(id: string, password: string): Promise<any> {
    console.log('test');
    const user = await this.authService.validateUser(id, password);
    if (!user) {
      console.log('un');
      return false;
    }
    return user;
  }
}
