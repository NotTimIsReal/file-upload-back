import { User } from 'src/model/user.model';
import { UnAuthenticatedGuard } from '../guards/unauthenticated.guard';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { getType } from 'mime';
import {
  Controller,
  Get,
  Req,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
  UseGuards,
  Body,
  Delete,
  Res,
  UploadedFiles,
  HttpException,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { AccountService } from './account.service';
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
  async getUser(@Param('username') username: string, @Req() req: Irequest) {
    if (req.user && username === '@me') {
      const account = await this.accountService.getAccount(req.user.userid);
      return await this.accountService.getAccountByName(account.username);
    } else if (!req.user && username === '@me') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return await this.accountService.getAccountByName(username);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id/files')
  getFiled(@Req() req: any, @Param('id') param): HttpStatus | object {
    if (req.user.userid !== param)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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
    if (req.user && req.user.userid !== id)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
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
    if (!f) return res.sendStatus(404);
    const extention =
      file.split('.').pop() === 'ts' ? 'js' : file.split('.').pop();
    res.setHeader('Content-Type', getType(extention) || 'text/plain');
    res.setHeader('Content-Disposition', 'inline');
    return res.send(f);
  }
  @UseGuards(AuthenticatedGuard)
  @Post(':id/newfile')
  @UseInterceptors(FilesInterceptor('file'))
  postNewFile(
    @Req() req: Irequest,
    @Param('id') param,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<HttpStatus> | HttpStatus {
    if (req.user.userid !== param)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    return this.accountService.postNewFile(file, param);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id/file/:file/download')
  async getFileAndDownload(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('file') file: string,
  ) {
    const f = await this.userService.getFilesByUserIdAndReturnAsBuffer(
      id,
      file,
    );
    if (!f)
      throw new HttpException(
        'Files Not Found',
        HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
      );
    const extention =
      file.split('.').pop() === 'ts' ? 'js' : file.split('.').pop();
    res.setHeader('Content-Type', getType(extention) || 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=${file}`);
    return res.send(f);
  }
  @UseGuards(AuthenticatedGuard)
  @Delete(':id/deletefile')
  async deleteFile(
    @Req() req: any,
    @Param('id') id: string,
    @Body('files') file: string,
  ): Promise<number | string[] | HttpException> {
    if (req.user.userid !== id) return 403;
    if (!file)
      throw new HttpException('File Not In Body', HttpStatus.NO_CONTENT);
    const allFiles = await this.userService.getFilesByUserId(id, true);
    const foundFile = allFiles.find((e) => e === file);
    if (!foundFile)
      throw new HttpException(
        'File Not Found',
        HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
      );
    return this.userService.deleteFileByUserId(id, file);
  }
  @UseGuards(AuthenticatedGuard)
  @Put('/:id/updatefile')
  async editFile(
    @Req() req: Irequest,
    @Param('id') id: string,
    @Body('file') file: string,
    @Body('content') content: string,
  ) {
    if (req.user.userid !== id) return 403;
    if (!content)
      throw new HttpException('No Content in body', HttpStatus.BAD_REQUEST);
    if (!file)
      throw new HttpException('File Not In Body', HttpStatus.BAD_REQUEST);
    return await this.accountService.editFile(file, id, content);
  }
}
interface Irequest extends Request {
  user: User;
}
