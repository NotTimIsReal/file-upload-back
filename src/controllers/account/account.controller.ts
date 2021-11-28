import { UnAuthenticatedGuard } from './../../guards/unauthenticated.guard';
import { UserService } from './../../services/user/user.service';
import { AuthenticatedGuard } from './../../guards/authenticated.guard';
import { LocalGuard } from './../../guards/local-auth.guard';
import {
  Controller,
  Get,
  Req,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  Delete,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express, Response } from 'express';
import { AccountService } from '../../services/account/account.service';
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}
  @Get('accounts')
  getAccounts(@Req() req: Request): any {
    return this.accountService.getAccounts(req);
  }
  @UseGuards(UnAuthenticatedGuard)
  @Post('signup')
  postSignUp(@Req() req: Request) {
    return this.accountService.postSignUp(req);
  }
  @Get(':id')
  getAccount(@Param('id') param) {
    return this.accountService.getAccount(param);
  }
  @Get('user/:username')
  async getUser(@Param('username') username: string, @Req() req: any) {
    if (req.user && username === '@me') {
      const account = await this.accountService.getAccount(req.user.userid);
      console.log(account);
      return await this.accountService.getAccountByName(account.username);
    } else if (!req.user && username === '@me')
      return HttpStatus.METHOD_NOT_ALLOWED;
    return await this.accountService.getAccountByName(username);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id/files')
  getFiled(@Req() req: any, @Param('id') param): HttpStatus | object {
    if (req.user.userid !== param) return 403;
    console.log('test');
    return this.accountService.getFiles(param);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id/file/:file')
  getFile(
    @Param('id') id: string,
    @Param('file') file: string,
    @Req() req: any,
  ) {
    if (req.user && req.user.userid !== id) return 403;
    return this.accountService.getFile(id, file);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id/file/:file/view')
  async getFileAndShowAsFile(
    @Param('id') id: string,
    @Param('file') file: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    if (req.user && req.user.userid !== id) return 403;
    const f = await this.userService.getFilesByUserIdAndReturnAsBuffer(
      id,
      file,
    );
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
    };
    const data = Buffer.from(f.toJSON().data);
    res.setHeader('Content-Type', ctypes[file.split('.').pop()]);
    res.send(data);
  }
  @UseGuards(AuthenticatedGuard)
  @Post(':id/newfile')
  @UseInterceptors(FileInterceptor('file'))
  postNewFile(
    @Req() req: Request | any,
    @Param('id') param,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<HttpStatus> | HttpStatus {
    if (req.user.userid !== param) return 403;
    return this.accountService.postNewFile(file, param, req);
  }
  @UseGuards(AuthenticatedGuard)
  @Delete(':id/deletefile')
  async deleteFile(
    @Req() req: any,
    @Param('id') id: string,
    @Body('files') file: string,
  ): Promise<number | string[]> {
    if (req.user.userid !== id) return 403;
    if (!file) return HttpStatus.NO_CONTENT;
    const allFiles = await this.userService.getFilesByUserId(id);
    const foundFile = allFiles.find((e) => e === file);
    if (!foundFile) return HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE;
    return this.userService.deleteFileByUserId(id, file);
  }
}
