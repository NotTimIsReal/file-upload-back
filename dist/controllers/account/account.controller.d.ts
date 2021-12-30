/// <reference types="multer" />
import { UserService } from './../../services/user/user.service';
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountService } from '../../services/account/account.service';
export declare class AccountController {
    private readonly accountService;
    private readonly userService;
    constructor(accountService: AccountService, userService: UserService);
    getAccounts(req: Request): any;
    postSignUp(req: Request): Promise<string | HttpStatus>;
    getAccount(param: any): Promise<any>;
    getUser(username: string, req: any): Promise<HttpStatus.METHOD_NOT_ALLOWED | 404 | {
        userid: string;
        username: string;
        createdAt: number;
        UploadedFileSize: string;
    }>;
    getFiled(req: any, param: any): HttpStatus | object;
    getFile(id: string, file: string, req: any): Promise<string> | 403;
    getFileAndShowAsFile(id: string, file: string, req: any, res: Response): Promise<Response<any, Record<string, any>> | 403>;
    postNewFile(req: Request | any, param: any, file: Express.Multer.File): Promise<HttpStatus> | HttpStatus;
    getFileAndDownload(res: Response, id: any, file: any): Promise<Response<any, Record<string, any>>>;
    deleteFile(req: any, id: string, file: string): Promise<number | string[]>;
}
