declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_API_URL: string
    NEXT_PUBLIC_SITE_URL: string
    NEXT_PUBLIC_GA_TRACKING_ID?: string
    DATABASE_URL?: string
    AUTH_SECRET?: string
  }
}
