import { LocalStrategy } from './../strategies/auth/local.strategy';
import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class LocalGuard extends AuthGuard('local') {}
