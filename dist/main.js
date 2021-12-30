"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv_1 = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const redis = require("redis");
const connectRedis = require("connect-redis");
const compression = require("compression");
(0, dotenv_1.config)({ path: './.env' });
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const redisStore = connectRedis(session);
    let redisClient;
    if (process.env.REDISPASS != undefined) {
        redisClient = redis.createClient({
            host: process.env.REDISHOST,
            port: process.env.REDISPORT,
        });
    }
    else {
        redisClient = redis.createClient({
            host: process.env.REDISHOST,
            port: process.env.REDISPORT,
            password: process.env.REDISPASS,
        });
    }
    redisClient.on('connect', function (err) {
        console.log('redis connected');
    });
    app.enableCors({
        exposedHeaders: 'Set-Cookie',
        allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
        origin: true,
        maxAge: 1000 * 604800,
        credentials: true,
    });
    app.use(compression());
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            maxAge: 1000 * 604800,
            sameSite: 'strict',
            httpOnly: false,
            secure: false,
        },
        store: new redisStore({ client: redisClient }),
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app
        .listen(process.env.PORT || 3000)
        .then(() => console.log('Listening on ' + process.env.PORT || 3000));
}
bootstrap();
//# sourceMappingURL=main.js.map