import { AuthService } from 'src/services/auth/auth.service';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getLogin(callback: string, res: Response): string | void;
    getSignOut(req: Request): number;
}
