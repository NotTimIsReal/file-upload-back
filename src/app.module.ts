import { SessionSerializer } from './serializers/session.serializer';
import { LocalStrategy } from './strategies/auth/local.strategy';
import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account/account.controller';
import { AccountService } from './services/account/account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserSchema } from './model/user.model';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { PassportModule } from '@nestjs/passport';
config({ path: './.env' });
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AccountController, AuthController],
  providers: [
    AccountService,
    AuthService,
    UserService,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AppModule {}
