import { Injectable, HttpStatus } from '@nestjs/common';
import { hasher } from './../account/account.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/model/user.model';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findUserById(id: string): Promise<any> {
    return await this.userModel.findOne({ userid: id });
  }
  async deleteUserById(id: string): Promise<HttpStatus> {
    await this.userModel.findOneAndDelete({ userid: id });
    return HttpStatus.OK;
  }
}
