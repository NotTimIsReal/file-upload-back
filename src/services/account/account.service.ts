import { User as user } from './../../model/user.model';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { createHash } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { outputFile } from 'fs-extra';
const accounts = [];
const hasher = (string: any): string => {
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
    @InjectModel('User') private readonly productModel: Model<user>,
  ) {}
  async getAccounts(request: Request) {
    const answer = [];
    if (!request.headers.authorization) return HttpStatus.UNAUTHORIZED;
    else {
      answer.push(...(await this.productModel.find()));
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
  }
  async getAccount(id: string): Promise<object> {
    const end = await this.productModel.findOne({ userid: id });
    return end;
  }
  postNewFile(file: Express.Multer.File, id, _req): HttpStatus {
    if (!file) return HttpStatus.NO_CONTENT;
    console.log(file);
    const filenames = file.originalname.replace(' ', '_').split('.');
    outputFile(
      `files/${id}/${filenames[0] + `(${id})`}` + `.${filenames[1]}`,
      file.buffer,
      (err) => {
        err ? console.log(err) : null;
      },
    );
    return 201;
  }
  getFiles(): Files {
    return {
      size: 100,
      lastCreated: 100000,
      mostUsedType: 't',
    };
  }
  async postSignUp(req: Request): Promise<string | HttpStatus> {
    const { password, email, username } = req.body;
    if (!password) return HttpStatus.NO_CONTENT;
    if (!email) return HttpStatus.NO_CONTENT;
    if (!username) return HttpStatus.NO_CONTENT;
    if (accounts.find((u) => u.username === username))
      return HttpStatus.NOT_ACCEPTABLE;
    const id = await uid();
    console.log(accounts);
    const p = hasher(password);
    const db = new this.productModel({
      userid: id,
      username,
      email,
      createdAt: Date.now(),
      password: p,
      UploadedFileSize: '0mb',
      lastUploaded: 0,
    });
    db.save();
    return `${201} ID:${id} `;
  }
}
