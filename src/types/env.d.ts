declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    RESEND_API_KEY: string;
    FROM_EMAIL?: string;
    ADMIN_EMAIL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 