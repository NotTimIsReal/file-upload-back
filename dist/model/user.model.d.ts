import * as mongoose from 'mongoose';
export declare const UserSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}>;
export declare class User {
    userid: string;
    createdAt: number;
    username: string;
    email: string;
    UploadedFileSize: string;
    lastUploaded: number;
    password: string;
    files: Array<string>;
    constructor(userid: string, createdAt: number, username: string, email: string, UploadedFileSize: string, lastUploaded: number, password: string, files: Array<string>);
}
