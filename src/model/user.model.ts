import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
  userid: { required: true, type: String },
  createdAt: { required: true, type: Number },
  username: { required: true, type: String },
  email: { required: true, type: String },
  UploadedFileSize: { required: true, type: String },
  lastUploaded: { required: true, type: Number },
  password: { required: true, type: String },
});
export class User {
  constructor(
    public userid: string,
    public createdAt: number,
    public username: string,
    public email: string,
    public UploadedFileSize: string,
    public lastUploaded: number,
    public password: string,
  ) {}
}
