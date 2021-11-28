import { User, User as user } from './../../model/user.model';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { createHash } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { outputFile } from 'fs-extra';
import { UserService } from '../user/user.service';
const accounts = [];
type publicuser = {
  userid: string;
  createdAt: number;
  username: string;
  UploadedFileSize: string;
  lastUploaded: number;
};
export const hasher = (string: any): string => {
  return createHash('sha256').update(string).digest('hex');
};
const uid = function () {
  return Math.floor(Math.random() * Date.now() * Math.random()).toString();
};

type Files = {
  size: number;
  mostUsedType?: string;
  lastCreated: number;
};
@Injectable()
export class AccountService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<user>,
    private readonly userService: UserService,
  ) {}
  async getAccounts(request: Request) {
    const answer = [];
    answer.push(...(await this.userModel.find()));
    const r = answer.map((e) => {
      const n = { ...e._doc };
      delete n['password'];
      delete n['email'];
      delete n['_v'];
      delete n['_id'];
      return n;
    });
    return r;
  }
  async getAccount(id: string): Promise<publicuser | number | any> {
    const end = await this.userModel.findOne({ userid: id });
    if (!end) return HttpStatus.NOT_FOUND;
    const { userid, createdAt, username, UploadedFileSize, lastUploaded } = end;
    return {
      userid,
      createdAt,
      username,
      UploadedFileSize,
      lastUploaded,
    };
  }
  async getAccountByName(name: string) {
    const acc = await this.userService.findUserByName(name);
    if (!acc) return 404;
    const { userid, username, createdAt, UploadedFileSize } = acc;

    return {
      userid,
      username,
      createdAt,
      UploadedFileSize,
    };
  }
  async postNewFile(file: Express.Multer.File, id, _req): Promise<HttpStatus> {
    if (!file) return HttpStatus.NO_CONTENT;
    const user = await this.userModel.findOne({ userid: id });
    if (!user) return HttpStatus.SERVICE_UNAVAILABLE;
    console.log(file);
    const filenames = file.originalname.replace(' ', '_');
    outputFile(`files/${id}/${filenames}`, file.buffer, (err) => {
      err ? console.log(err) : null;
    });
    const files = [...(await this.userModel.findOne({ userid: id })).files];
    files.push(`files/${id}/${filenames}`);
    await this.userModel.updateOne(
      { userid: id },
      {
        lastUploaded: Date.now(),
        files,
      },
    );
    return 201;
  }
  async getFiles(id: string): Promise<{ files: any[] }> {
    return {
      files: (await this.userModel.findOne({ userid: id })).files,
    };
  }
  async postSignUp(req: Request): Promise<string | HttpStatus> {
    const { password, email, username } = req.body;
    if (!password) return HttpStatus.NO_CONTENT;
    if (!email) return HttpStatus.NO_CONTENT;
    if (!username) return HttpStatus.NO_CONTENT;
    if (await this.userService.findUserByName(username))
      return HttpStatus.NOT_ACCEPTABLE;
    if (!RegExp(/^\S+@\S+\.\S+$/).test(email)) return HttpStatus.NOT_ACCEPTABLE;
    const id = await uid();
    console.log(accounts);
    const p = hasher(password);
    const db = new this.userModel({
      userid: id,
      username,
      email,
      createdAt: Date.now(),
      password: p,
      UploadedFileSize: '0mb',
      lastUploaded: 0,
      files: [],
    });
    db.save();
    return `${201} ID:${id} `;
  }
}
