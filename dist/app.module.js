"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const session_serializer_1 = require("./serializers/session.serializer");
const local_strategy_1 = require("./strategies/auth/local.strategy");
const common_1 = require("@nestjs/common");
const account_controller_1 = require("./controllers/account/account.controller");
const account_service_1 = require("./services/account/account.service");
const mongoose_1 = require("@nestjs/mongoose");
const dotenv_1 = require("dotenv");
const user_model_1 = require("./model/user.model");
const auth_controller_1 = require("./controllers/auth/auth.controller");
const auth_service_1 = require("./services/auth/auth.service");
const user_service_1 = require("./services/user/user.service");
const passport_1 = require("@nestjs/passport");
(0, dotenv_1.config)({ path: './.env' });
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.DB),
            mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_model_1.UserSchema }]),
            passport_1.PassportModule.register({ session: true }),
        ],
        controllers: [account_controller_1.AccountController, auth_controller_1.AuthController],
        providers: [
            account_service_1.AccountService,
            auth_service_1.AuthService,
            user_service_1.UserService,
            local_strategy_1.LocalStrategy,
            session_serializer_1.SessionSerializer,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map