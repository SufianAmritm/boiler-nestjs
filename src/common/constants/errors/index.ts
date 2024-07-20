export const SYSTEM_ERROR_MESSAGES = {
  NODE_ENV:
    "NODE_ENV is required and must be one of 'dev', 'qa', 'uat', 'prod'.",
  STRING_ENV_VAR: (envVar: string): string =>
    `${envVar} is required and must be a string`,
  NUMBER_ENV_VAR: (envVar: string): string =>
    `${envVar} is required and must be a number`,
};

export const APP_ERROR_MESSAGES = {
  ALREADY_EXISTS: (entity: string, property?: string) => {
    return `${entity} ${property ? `with ${property} ` : ''}already exists.`;
  },
  ALREADY_EXISTS_WITH_DELETED: (entity: string) =>
    `${entity} already exists with deleted flag.`,
  NOT_FOUND: (entity: string) => `${entity} not found.`,
  ALREADY_DELETED: (entity: string) => `${entity} already deleted.`,
  ALREADY_IN_ACTIVE: (entity: string) => `${entity} already inactive.`,
  ALREADY_ACTIVE: (entity: string) => `${entity} already active.`,
  INVALID_PASSWORD: 'Invalid password.',
  ALREADY_VERIFIED: 'User already verified.',
  ALREADY_USED: 'Token is already used.',
  EXPIRED_TOKEN: 'Token is expired.',
  NOT_VERIFIED: 'User not verified.',
  FAILED_OPERATION: (operation: string) => `Failed to ${operation}.`,
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  MAX_FILE_SIZE: (size: string) => `File size exceeds the limit of ${size}`,
};
