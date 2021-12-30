import { UserService } from './../user/user.service';
import { Response, Request } from 'express';
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    getLogin(callback?: string, res?: Response): any;
    getSignOut(req: Request): number;
    validateUser(id: string, password: string): Promise<any>;
}
