import { SessionSerializer } from './serializers/session.serializer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserService } from './user/user.service';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { UserSchema } from './model/user.model';
import { UserModule } from './user/user.module';
config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB),
    PassportModule.register({ session: true }),
    AccountModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [SessionSerializer],
})
export class AppModule {}
