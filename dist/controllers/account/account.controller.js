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
exports.AccountController = void 0;
const unauthenticated_guard_1 = require("./../../guards/unauthenticated.guard");
const user_service_1 = require("./../../services/user/user.service");
const authenticated_guard_1 = require("./../../guards/authenticated.guard");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const account_service_1 = require("../../services/account/account.service");
let AccountController = class AccountController {
    constructor(accountService, userService) {
        this.accountService = accountService;
        this.userService = userService;
    }
    getAccounts(req) {
        return this.accountService.getAccounts(req);
    }
    postSignUp(req) {
        return this.accountService.postSignUp(req);
    }
    getAccount(param) {
        return this.accountService.getAccount(param);
    }
    async getUser(username, req) {
        if (req.user && username === '@me') {
            const account = await this.accountService.getAccount(req.user.userid);
            console.log(account);
            return await this.accountService.getAccountByName(account.username);
        }
        else if (!req.user && username === '@me')
            return common_1.HttpStatus.METHOD_NOT_ALLOWED;
        return await this.accountService.getAccountByName(username);
    }
    getFiled(req, param) {
        if (req.user.userid !== param)
            return 403;
        console.log('test');
        return this.accountService.getFiles(param);
    }
    getFile(id, file, req) {
        if (req.user && req.user.userid !== id)
            return 403;
        return this.accountService.getFile(id, file);
    }
    async getFileAndShowAsFile(id, file, req, res) {
        if (req.user && req.user.userid !== id)
            return 403;
        const f = await this.userService.getFilesByUserIdAndReturnAsBuffer(id, file);
        if (!f)
            return res.sendStatus(404);
        const ctypes = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            txt: 'text/plain',
            json: 'application/json',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            js: 'application/javascript',
            html: 'text/html',
            css: 'text/css',
            mp4: 'video/mp4',
            avi: 'video/x-msvideo',
            mp3: 'audio/mpeg',
            wav: 'audio/x-wav',
            flac: 'audio/flac',
            ogg: 'audio/ogg',
            webm: 'video/webm',
            mkv: 'video/x-matroska',
            psd: 'image/vnd.adobe.photoshop',
            zip: 'application/zip',
            ts: 'application/javascript',
        };
        const data = Buffer.from(f.toJSON().data);
        res.setHeader('Content-Type', ctypes[file.split('.').pop()] || 'text/plain');
        res.send(data);
        return;
    }
    postNewFile(req, param, file) {
        if (req.user.userid !== param)
            return 403;
        return this.accountService.postNewFile(file, param, req);
    }
    async getFileAndDownload(res, id, file) {
        const f = await this.userService.getFilesByUserIdAndReturnAsBuffer(id, file);
        if (!f)
            return res.sendStatus(404);
        const ctypes = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            txt: 'text/plain',
            json: 'application/json',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            js: 'application/javascript',
            html: 'text/html',
            css: 'text/css',
            mp4: 'video/mp4',
            avi: 'video/x-msvideo',
            mp3: 'audio/mpeg',
            wav: 'audio/x-wav',
            flac: 'audio/flac',
            ogg: 'audio/ogg',
            webm: 'video/webm',
            mkv: 'video/x-matroska',
            psd: 'image/vnd.adobe.photoshop',
            zip: 'application/zip',
            ts: 'application/javascript',
        };
        const data = Buffer.from(f.toJSON().data);
        res.setHeader('Content-Type', ctypes[file.split('.').pop()] || 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=${file}`);
        res.send(data);
        return;
    }
    async deleteFile(req, id, file) {
        if (req.user.userid !== id)
            return 403;
        if (!file)
            return common_1.HttpStatus.NO_CONTENT;
        const allFiles = await this.userService.getFilesByUserId(id);
        const foundFile = allFiles.find((e) => e === file);
        if (!foundFile)
            return common_1.HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE;
        return this.userService.deleteFileByUserId(id, file);
    }
};
__decorate([
    (0, common_1.Get)('accounts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AccountController.prototype, "getAccounts", null);
__decorate([
    (0, common_1.UseGuards)(unauthenticated_guard_1.UnAuthenticatedGuard),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "postSignUp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Get)('user/:username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getUser", null);
__decorate([
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Get)(':id/files'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AccountController.prototype, "getFiled", null);
__decorate([
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Get)(':id/file/:file'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('file')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "getFile", null);
__decorate([
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Get)(':id/file/:file/view'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('file')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getFileAndShowAsFile", null);
__decorate([
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Post)(':id/newfile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Object)
], AccountController.prototype, "postNewFile", null);
__decorate([
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Get)(':id/file/:file/download'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getFileAndDownload", null);
__decorate([
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Delete)(':id/deletefile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('files')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteFile", null);
AccountController = __decorate([
    (0, common_1.Controller)('account'),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        user_service_1.UserService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map