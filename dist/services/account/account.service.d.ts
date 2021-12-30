/// <reference types="multer" />
import { User as user } from './../../model/user.model';
import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
declare type publicuser = {
    userid: string;
    createdAt: number;
    username: string;
    UploadedFileSize: string;
    lastUploaded: number;
};
export declare const hasher: (string: any) => string;
export declare class AccountService {
    private readonly userModel;
    private readonly userService;
    constructor(userModel: Model<user>, userService: UserService);
    getAccounts(request: Request): Promise<any[]>;
    getAccount(id: string): Promise<publicuser | number | any>;
    getAccountByName(name: string): Promise<404 | {
        userid: string;
        username: string;
        createdAt: number;
        UploadedFileSize: string;
    }>;
    postNewFile(file: Express.Multer.File, id: any, _req: any): Promise<HttpStatus>;
    getFiles(id: string): Promise<{
        files: any[];
    }>;
    postSignUp(req: Request): Promise<string | HttpStatus>;
    getFile(file: string, id: string): Promise<string>;
}
export {};
