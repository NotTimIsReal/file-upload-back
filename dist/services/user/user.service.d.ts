/// <reference types="node" />
import { HttpStatus } from '@nestjs/common';
import { User } from 'src/model/user.model';
import { Model, Types } from 'mongoose';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    findUserById(id: string): Promise<User>;
    findUserByName(name: string): Promise<import("mongoose").Document<any, any, User> & User & {
        _id: Types.ObjectId;
    }>;
    deleteUserById(id: string): Promise<HttpStatus>;
    getFilesByUserId(id: string): Promise<Array<string>>;
    deleteFileByUserId(id: string, file: string): Promise<string[]>;
    getFileByUserId(id: string, file: string): Promise<string>;
    getFilesByUserIdAndReturnAsBuffer(id: string, file: string): Promise<Buffer | null>;
}
