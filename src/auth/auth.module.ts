import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/model/user.model';
import { SessionSerializer } from 'src/serializers/session.serializer';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
