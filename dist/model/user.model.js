"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    userid: { required: true, type: String },
    createdAt: { required: true, type: Number },
    username: { required: true, type: String },
    email: { required: true, type: String },
    UploadedFileSize: { required: true, type: String },
    lastUploaded: { required: true, type: Number },
    password: { required: true, type: String },
    files: { type: Array },
});
class User {
    constructor(userid, createdAt, username, email, UploadedFileSize, lastUploaded, password, files) {
        this.userid = userid;
        this.createdAt = createdAt;
        this.username = username;
        this.email = email;
        this.UploadedFileSize = UploadedFileSize;
        this.lastUploaded = lastUploaded;
        this.password = password;
        this.files = files;
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map