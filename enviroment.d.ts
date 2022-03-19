namespace NodeJs {
  interface ProcessEnv {
    REDISPORT: number;
    PORT: number;
    DB: string;
    SECRET: string;
    REDISHOST: string;
    REDISPASS?: string;
    DOMAIN: string;
  }
}
