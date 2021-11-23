declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DB: string;
    SECRET: string;
    REDISHOST: string;
    REDISPORT: number;
  }
}
