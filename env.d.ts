declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    DATABASE_TYPE: 'postgres';
    DATABASE_URL: string;
    DATABASE_PORT: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    SESSION_SECRET: string;
    REDIS_URL: string;
    PORT: any;
  }
}
