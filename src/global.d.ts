declare global {
  namespace NodeJS {
   interface ProcessEnv {
      NODE_ENV: 'dev' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
      MONGODB_URI_TEST: string;
      JWT_SECRET_KEY: string;
      CURRENCY_API_ENDPOINT: string;
      AIRBNB_SEARCH_URI_FRONT: string;
      AIRBNB_SEARCH_URI_MID: string;
      AIRBNB_SEARCH_URI_BACK: string;
    }
  }
}

export {};
