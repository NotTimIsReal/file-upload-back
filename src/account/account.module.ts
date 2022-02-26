import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserSchema } from '../model/user.model';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AccountController],
  providers: [AccountService, UserService],
})
export class AccountModule {}
