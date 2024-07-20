import * as dotenv from 'dotenv';

dotenv.config();

export const localDbConfig = {
  database: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA,
    ssl: false,
  },
};
export const prodDbConfig = {
  database: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA,
    ssl: false,
  },
};
export const dbEnvironment = process.env.NODE_ENV;
