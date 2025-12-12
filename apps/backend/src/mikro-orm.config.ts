import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import {
  DATABASE_DEFAULT_HOST,
  DATABASE_DEFAULT_PORT,
  DATABASE_DEFAULT_USERNAME,
  DATABASE_DEFAULT_PASSWORD,
  DATABASE_DEFAULT_NAME,
} from './infra/database/constants';
import {
  TcgGame,
  TcgCard,
  TcgCardPrinting,
  TcgCardSource,
  TcgSet,
  TcgSetSource,
  TcgSeries,
} from '@repo/shared-types';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  entities: [
    TcgCardPrinting,
    TcgCardSource,
    TcgCard,
    TcgGame,
    TcgSeries,
    TcgSetSource,
    TcgSet,
  ],
  host: process.env.DB_HOST ?? DATABASE_DEFAULT_HOST,
  port: parseInt(process.env.DB_PORT ?? DATABASE_DEFAULT_PORT.toString()),
  user: process.env.DB_USERNAME ?? DATABASE_DEFAULT_USERNAME,
  password: process.env.DB_PASSWORD ?? DATABASE_DEFAULT_PASSWORD,
  dbName: process.env.DB_NAME ?? DATABASE_DEFAULT_NAME,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    defaultSeeder: 'DatabaseSeeder',
    path: 'dist/seeders/',
    pathTs: 'src/seeders',
  },
  extensions: [Migrator, SeedManager],

  // this is inferred as you import `defineConfig` from sqlite package
  driver: PostgreSqlDriver,
});
