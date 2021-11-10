import { Injectable, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
type AccountsInfo = {
  size: number;
  largestUpload: number;
  byteType: 'mb' | 'gb' | 'b' | 'tb';
  lastCreated?: Date;
};
type User = {
  id: number;
  createdAt: number;
  username: string;
  email: string;
  UlloadedFileSize: string;
  lastUploaded: number;
};
@Injectable()
export class AccountService {
  getAccounts(request: Request): AccountsInfo | HttpStatus {
    if (!request.headers.authorization) return HttpStatus.UNAUTHORIZED;
    else
      return {
        size: 1,
        largestUpload: 100,
        byteType: 'gb',
      };
  }
  getAccount(id: string): User {
    id;
    return {
      id: 9043,
      createdAt: 29384820,
      username: 'John Doe',
      email: 'doe@doe.com',
      UlloadedFileSize: '100mb',
      lastUploaded: 9393994,
    };
  }
}
