import { Module } from '@nestjs/common';
import { AccountController } from './account/account.controller';
@Module({
  imports: [],
  controllers: [AccountController],
  providers: [],
})
export class AppModule {}
