import { Sequelize } from 'sequelize-typescript';
import {
  DATABASE_SEQUELIZE_PROVIDER_NAME,
  DATABASE_DEFAULT_DIALECT,
  DATABASE_DEFAULT_HOST,
  DATABASE_DEFAULT_PORT,
  DATABASE_DEFAULT_USERNAME,
  DATABASE_DEFAULT_PASSWORD,
  DATABASE_DEFAULT_NAME,
} from './constants';
import { PokemonCard } from 'src/pokemon-card/entities/pokemon-card.entity';
import { PokemonSet } from 'src/pokemon-set/entities/pokemon-set.entity';
import { PokemonSeries } from 'src/pokemon-series/entities/pokemon-series.entity';

export const databaseProviders = [
  {
    provide: DATABASE_SEQUELIZE_PROVIDER_NAME,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: DATABASE_DEFAULT_DIALECT,
        host: process.env.DB_HOST ?? DATABASE_DEFAULT_HOST,
        port: parseInt(process.env.DB_PORT ?? DATABASE_DEFAULT_PORT.toString()),
        username: process.env.DB_USERNAME ?? DATABASE_DEFAULT_USERNAME,
        password: process.env.DB_PASSWORD ?? DATABASE_DEFAULT_PASSWORD,
        database: process.env.DB_NAME ?? DATABASE_DEFAULT_NAME,
        // autoLoadModels: false,
        // synchronize: false,
        // logging: process.env.DB_LOGGING === 'true' ? console.log : false,
      });
      sequelize.addModels([
        // Add entities
        PokemonCard,
        PokemonSet,
        PokemonSeries,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
