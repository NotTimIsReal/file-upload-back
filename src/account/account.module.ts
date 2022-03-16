import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
@Module({
  imports: [UserModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
