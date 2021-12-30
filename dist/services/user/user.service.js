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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../../model/user.model");
const mongoose_2 = require("mongoose");
const fs_1 = require("fs");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findUserById(id) {
        return await this.userModel.findOne({ userid: id });
    }
    async findUserByName(name) {
        return await this.userModel.findOne({ username: name });
    }
    async deleteUserById(id) {
        await this.userModel.findOneAndDelete({ userid: id });
        return common_1.HttpStatus.OK;
    }
    async getFilesByUserId(id) {
        const user = await this.findUserById(id);
        return user.files;
    }
    async deleteFileByUserId(id, file) {
        const allFiles = await this.getFilesByUserId(id);
        const newarr = allFiles.filter((e) => e !== file);
        await this.userModel.updateOne({ userid: id }, { files: newarr });
        (0, fs_1.unlink)(file, (err) => {
            if (err)
                return console.error(err);
        });
        return await this.getFilesByUserId(id);
    }
    async getFileByUserId(id, file) {
        console.log(file);
        const allFiles = await this.getFilesByUserId(id);
        const newarr = allFiles.filter((e) => e.split('/')[2] === file);
        console.log(newarr);
        return newarr[0];
    }
    async getFilesByUserIdAndReturnAsBuffer(id, file) {
        const allFiles = await this.getFilesByUserId(id);
        const newarr = allFiles.filter((e) => e.split('/')[2] === file);
        if (!newarr[0])
            return null;
        const buffer = (0, fs_1.readFileSync)(newarr[0]);
        return buffer;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map