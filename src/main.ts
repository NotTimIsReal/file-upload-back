import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import redis from 'redis';
import connectRedis from 'connect-redis';
import compression from 'compression';
config({ path: './.env' });
async function bootstrap() {
  const db = `redis://${process.env.REDISHOST}:${process.env.REDISPORT}`;
  const app = await NestFactory.create(AppModule);
  const redisStore = connectRedis(session);
  const client = redis.createClient({
    url: db,
  });
  client.connect();
  client.ping();
  client.on('connect', function (err) {
    console.log('redis connected');
  });
  app.enableCors({
    origin: true,
    maxAge: 1000 * 604800,
    credentials: true,
  });
  app.use(
    compression({
      quality: 'high',
    }),
  );
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
        secure: true,
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
