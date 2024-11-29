import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters long'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

export type EnvConfig = z.infer<typeof envSchema>

function validateEnv(): EnvConfig {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error(
        'JWT_SECRET is not set. Please set it in your environment variables.\n' +
        'You can generate a secure secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
      )
    }

    const config = {
      JWT_SECRET: process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    }

    return envSchema.parse(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path}: ${err.message}`).join('\n')
      throw new Error(`Environment validation failed:\n${errors}`)
    }
    throw error
  }
}

export const config = validateEnv()
