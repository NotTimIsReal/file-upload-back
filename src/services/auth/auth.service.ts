import { UserService } from './../user/user.service';
import { hasher } from './../account/account.service';
import { Injectable, HttpStatus } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  getLogin(): HttpStatus {
    return HttpStatus.OK;
  }
  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.userService.findUserById(id);
    if (user && user.password === hasher(password)) {
      const { userid, createdAt, username, UploadedFileSize, lastUploaded } =
        user;
      return {
        userid,
        createdAt,
        username,
        UploadedFileSize,
        lastUploaded,
      };
    } else return null;
  }
}
