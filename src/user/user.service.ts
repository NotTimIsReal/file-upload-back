import { Injectable, HttpStatus } from '@nestjs/common';
import { hasher } from './../account/account.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/model/user.model';
import { Model, Types } from 'mongoose';
import { unlink, readFileSync as readFile, statSync } from 'fs';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findUserById(id: string): Promise<User> {
    return await this.userModel.findOne({ userid: id });
  }
  async findUserByName(name: string) {
    return await this.userModel.findOne({ username: name });
  }
  async deleteUserById(id: string): Promise<HttpStatus> {
    await this.userModel.findOneAndDelete({ userid: id });
    return HttpStatus.OK;
  }
  async getFilesByUserId(id: string, noPaths = false): Promise<Array<string>> {
    const user = await this.findUserById(id);
    console.log(user);
    if (!noPaths) return user.files;
    else {
      const arr = user.files.map((e) => e.split('/')[2]);
      return arr;
    }
  }
  async deleteFileByUserId(id: string, file: string): Promise<string[]> {
    const allFiles = await this.getFilesByUserId(id);
    const newarr = allFiles.filter((e) => e.split('/')[2] !== file);
    await this.userModel.updateOne({ userid: id }, { files: newarr });
    unlink(`files/${id}/${file}`, (err) => {
      if (err) return console.error(err);
    });
    await delay(500);
    let fileSize = 0;
    for (const file of newarr) {
      fileSize += getSize(`/files/${id}/${file}`);
    }
    await this.userModel.updateOne(
      { userid: id },
      { UploadedFileSize: fileSize },
    );
    return await this.getFilesByUserId(id);
  }
  async getFileByUserId(id: string, file: string): Promise<string> {
    console.log(file);
    const allFiles = await this.getFilesByUserId(id);
    const newarr = allFiles.filter((e) => e.split('/')[2] === file);
    console.log(newarr);
    return newarr[0];
  }
  async getFilesByUserIdAndReturnAsBuffer(
    id: string,
    file: string,
  ): Promise<Buffer | null> {
    const allFiles = await this.getFilesByUserId(id);
    const newarr = allFiles.filter((e) => e.split('/')[2] === file);
    if (!newarr[0]) return null;
    const buffer = readFile(newarr[0]);
    return buffer;
  }
}
function getSize(filename: string): number {
  const stats = statSync(filename);
  const fileSizeInBytes = stats.size;
  return Math.floor(fileSizeInBytes);
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
