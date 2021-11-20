import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account/account.controller';
import { AccountService } from './services/account/account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserSchema } from './model/user.model';
config({ path: './.env' });
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AppModule {}
