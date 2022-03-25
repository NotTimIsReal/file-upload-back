import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
config();
async function bootstrap() {
  const db = `redis://${process.env.REDISHOST}:${process.env.REDISPORT}`;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const redisStore = connectRedis(session);
  const client = redis.createClient({
    url: db,
    legacyMode: true,
  });
  client.connect();
  client.ping();
  client.on('connect', function () {
    console.log('redis connected');
  });
  app.enableCors({
    origin: true,
    maxAge: 1000 * 604800,
    credentials: true,
  });
  app.use(compression());
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 604800,
        sameSite: 'lax',
        httpOnly: false,
      },
      store: new redisStore({ client }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app
    .listen(process.env.PORT || 3000)
    .then(() => console.log('Listening on ' + process.env.PORT || 3000));
}
bootstrap();
