import { ENVIRONMENTS } from 'src/common/constants/enums';
import { SYSTEM_ERROR_MESSAGES } from 'src/common/constants/errors';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.nativeEnum(ENVIRONMENTS, {
    required_error: SYSTEM_ERROR_MESSAGES.NODE_ENV,
  }),
  PORT: z.coerce.number({
    required_error: SYSTEM_ERROR_MESSAGES.NUMBER_ENV_VAR('PORT'),
  }),
  BASE_FRONT_END_URL: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('BASE_FRONT_END_URL'),
  }),
  DB_USERNAME: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DB_USERNAME'),
  }),
  DB_PASSWORD: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DB_PASSWORD'),
  }),
  DB_HOST: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DB_HOST'),
  }),
  DB_PORT: z.coerce.number({
    required_error: SYSTEM_ERROR_MESSAGES.NUMBER_ENV_VAR('DB_PORT'),
  }),
  DB_SCHEMA: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DB_SCHEMA'),
  }),
  DB_CONNECTION_NAME: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DB_CONNECTION_NAME'),
  }),
  DB_NAME: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DB_NAME'),
  }),
  JWT_ACCESS_SECRET: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('JWT_ACCESS_SECRET'),
  }),
  JWT_REFRESH_SECRET: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('JWT_REFRESH_SECRET'),
  }),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    ),
  }),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    ),
  }),
  EMAIL_VERIFICATION_EXPIRATION_MINUTES: z.coerce.number({
    required_error: SYSTEM_ERROR_MESSAGES.NUMBER_ENV_VAR(
      'EMAIL_VERIFICATION_EXPIRATION_MINUTES',
    ),
  }),
  MAILGUN_API_KEY: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('MAILGUN_API_KEY'),
  }),
  DOMAIN: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('DOMAIN'),
  }),
  MAILGUN_HOST: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('MAILGUN_HOST'),
  }),
  FROM_EMAIL: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('FROM_EMAIL'),
  }),
  SERVER_KEY: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('SERVER_KEY'),
  }),
  SERVER_IV: z.string({
    required_error: SYSTEM_ERROR_MESSAGES.STRING_ENV_VAR('SERVER_IV'),
  }),
});
export type Env = z.infer<typeof envSchema>;
