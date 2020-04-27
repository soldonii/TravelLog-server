declare global {
  namespace NodeJS {
   interface ProcessEnv {
      NODE_ENV: 'dev' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
      MONGODB_URI_TEST: string;
      JWT_SECRET_KEY: string;
    }
  }
}

export {};
