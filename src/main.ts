import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import * as compression from 'compression';
config({ path: './.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisStore = connectRedis(session);
  let redisClient: redis.RedisClient;
  if (!process.env.REDISPASS) {
    redisClient = redis.createClient({
      host: process.env.REDISHOST,
      port: process.env.REDISPORT,
    });
  } else {
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
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    origin: true,
    maxAge: 1000 * 604800,
    credentials: true,
  });
  app.use(compression());
  app.use(
    session({
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
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app
    .listen(process.env.PORT || 3000)
    .then(() => console.log('Listening on ' + process.env.PORT || 3000));
}
bootstrap();
