// src/database/sequelize-cli.config.ts
import { Dialect } from 'sequelize';

export = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'supersecret',
    database: process.env.DB_NAME || 'mass-entry',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
    logging: console.log,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
    logging: false,
  },
};
