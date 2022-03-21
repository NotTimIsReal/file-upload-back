import { User as user } from '../model/user.model';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { createHash } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { outputFile } from 'fs-extra';
import { UserService } from '../user/user.service';
import * as fs from 'fs';
import { writeFileSync } from 'fs';
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
  async getAccounts(req: Request) {
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
    r.forEach((n) => {
      if (!n.avatar) {
        n.avatar = this.generateAvatar(n.username);
      }
    });
    if (r.length === 0) {
      req.body = {
        password: 'admin',
        username: 'admin',
        email: 'admin@example.com',
      };
      await this.postSignUp(req);
      return this.getAccounts(req);
    }
    return r;
  }
  async getAccount(id: string): Promise<publicuser | number | any> {
    const end = await this.userModel.findOne({ userid: id });
    if (!end) return HttpStatus.NOT_FOUND;
    const {
      userid,
      createdAt,
      username,
      UploadedFileSize,
      lastUploaded,
      avatar,
      files,
    } = end;
    return {
      userid,
      createdAt,
      username,
      UploadedFileSize,
      lastUploaded,
      avatar: avatar || this.generateAvatar(username),
      files,
    };
  }
  async getAccountByName(name: string) {
    const acc = await this.userService.findUserByName(name);
    if (!acc) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    const { userid, username, createdAt, UploadedFileSize, files } = acc;
    let { avatar } = acc;
    if (!avatar) {
      avatar = this.generateAvatar(username);
    }

    return {
      userid,
      username,
      createdAt,
      UploadedFileSize,
      avatar,
      files,
    };
  }
  async postNewFile(
    file: Express.Multer.File[],
    id: string,
  ): Promise<HttpStatus> {
    if (!file) return HttpStatus.NO_CONTENT;
    const user = await this.userModel.findOne({ userid: id });
    if (!user) return HttpStatus.SERVICE_UNAVAILABLE;
    const files = [...(await this.userModel.findOne({ userid: id })).files];
    for (const f of file) {
      const filenames = f.originalname.replace(/ /g, '_');
      outputFile(`files/${id}/${filenames}`, f.buffer, (err) => {
        err ? console.log(err) : null;
      });

      files.push(`files/${id}/${filenames}`);
    }
    let filesize = 0;
    delay(1000);
    for (const f of files) {
      filesize += getSize(f);
    }
    await this.userModel.updateOne(
      { userid: id },
      {
        lastUploaded: Date.now(),
        files,
        UploadedFileSize: filesize,
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
      throw new HttpException('User Already Exists', HttpStatus.NOT_ACCEPTABLE);
    if (!RegExp(/^\S+@\S+\.\S+$/).test(email))
      throw new HttpException('Email Invalid', HttpStatus.NOT_ACCEPTABLE);
    const id = await uid();
    const p = hasher(password);
    const db = new this.userModel({
      userid: id,
      username,
      email,
      createdAt: Date.now(),
      password: p,
      UploadedFileSize: '0',
      lastUploaded: 0,
      files: [],
    });
    db.save();
    return `${201} ID:${id} `;
  }
  async getFile(file: string, id: string): Promise<string> {
    const fileFound = await this.userService.getFileByUserId(file, id);
    return fileFound;
  }
  generateAvatar(seed: string): string {
    return `https://avatars.dicebear.com/api/identicon/${seed}.svg`;
  }
  async editFile(file: string, id: string, data: string) {
    const files = await this.userService.getFilesByUserId(id);
    let filesize = 0;
    if (!(await this.userService.getFileByUserId(id, file)))
      throw new HttpException('File Not Found', HttpStatus.NOT_FOUND);
    writeFileSync(`files/${id}/${file}`, data, {
      encoding: 'utf8',
    });
    delay(500);
    for (const f of files) {
      filesize += getSize(f);
    }
    await this.userModel.updateOne(
      { userid: id },
      { UploadedFileSize: filesize },
    );
    return HttpStatus.OK;
  }
}
function getSize(filename: string): number {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return Math.floor(fileSizeInBytes);
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
