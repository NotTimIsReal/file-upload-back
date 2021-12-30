"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = exports.hasher = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs_extra_1 = require("fs-extra");
const user_service_1 = require("../user/user.service");
const accounts = [];
const hasher = (string) => {
    return (0, crypto_1.createHash)('sha256').update(string).digest('hex');
};
exports.hasher = hasher;
const uid = function () {
    return Math.floor(Math.random() * Date.now() * Math.random()).toString();
};
let AccountService = class AccountService {
    constructor(userModel, userService) {
        this.userModel = userModel;
        this.userService = userService;
    }
    async getAccounts(request) {
        const answer = [];
        answer.push(...(await this.userModel.find()));
        const r = answer.map((e) => {
            const n = Object.assign({}, e._doc);
            delete n['password'];
            delete n['email'];
            delete n['_v'];
            delete n['_id'];
            return n;
        });
        return r;
    }
    async getAccount(id) {
        const end = await this.userModel.findOne({ userid: id });
        if (!end)
            return common_1.HttpStatus.NOT_FOUND;
        const { userid, createdAt, username, UploadedFileSize, lastUploaded } = end;
        return {
            userid,
            createdAt,
            username,
            UploadedFileSize,
            lastUploaded,
        };
    }
    async getAccountByName(name) {
        const acc = await this.userService.findUserByName(name);
        if (!acc)
            return 404;
        const { userid, username, createdAt, UploadedFileSize } = acc;
        return {
            userid,
            username,
            createdAt,
            UploadedFileSize,
        };
    }
    async postNewFile(file, id, _req) {
        if (!file)
            return common_1.HttpStatus.NO_CONTENT;
        const user = await this.userModel.findOne({ userid: id });
        if (!user)
            return common_1.HttpStatus.SERVICE_UNAVAILABLE;
        console.log(file);
        const filenames = file.originalname.replace(/ /g, '_');
        (0, fs_extra_1.outputFile)(`files/${id}/${filenames}`, file.buffer, (err) => {
            err ? console.log(err) : null;
        });
        const files = [...(await this.userModel.findOne({ userid: id })).files];
        files.push(`files/${id}/${filenames}`);
        await this.userModel.updateOne({ userid: id }, {
            lastUploaded: Date.now(),
            files,
        });
        return 201;
    }
    async getFiles(id) {
        return {
            files: (await this.userModel.findOne({ userid: id })).files,
        };
    }
    async postSignUp(req) {
        const { password, email, username } = req.body;
        if (!password)
            return common_1.HttpStatus.NO_CONTENT;
        if (!email)
            return common_1.HttpStatus.NO_CONTENT;
        if (!username)
            return common_1.HttpStatus.NO_CONTENT;
        if (await this.userService.findUserByName(username))
            return common_1.HttpStatus.NOT_ACCEPTABLE;
        if (!RegExp(/^\S+@\S+\.\S+$/).test(email))
            return common_1.HttpStatus.NOT_ACCEPTABLE;
        const id = await uid();
        console.log(accounts);
        const p = (0, exports.hasher)(password);
        const db = new this.userModel({
            userid: id,
            username,
            email,
            createdAt: Date.now(),
            password: p,
            UploadedFileSize: '0mb',
            lastUploaded: 0,
            files: [],
        });
        db.save();
        return `${201} ID:${id} `;
    }
    async getFile(file, id) {
        const fileFound = await this.userService.getFileByUserId(file, id);
        return fileFound;
    }
};
AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map