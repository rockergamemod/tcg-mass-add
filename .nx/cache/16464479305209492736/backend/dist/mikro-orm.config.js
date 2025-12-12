"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const constants_1 = require("./infra/database/constants");
const database_1 = require("./infra/database");
const migrations_1 = require("@mikro-orm/migrations");
const seeder_1 = require("@mikro-orm/seeder");
const tcg_series_entity_1 = require("./infra/database/tcg-series.entity");
const tcg_set_source_entity_1 = require("./infra/database/tcg-set-source.entity");
exports.default = (0, postgresql_1.defineConfig)({
    entities: [
        database_1.TcgCardPrinting,
        database_1.TcgCardSource,
        database_1.TcgCard,
        database_1.TcgGame,
        tcg_series_entity_1.TcgSeries,
        tcg_set_source_entity_1.TcgSetSource,
        database_1.TcgSet,
    ],
    host: process.env.DB_HOST ?? constants_1.DATABASE_DEFAULT_HOST,
    port: parseInt(process.env.DB_PORT ?? constants_1.DATABASE_DEFAULT_PORT.toString()),
    user: process.env.DB_USERNAME ?? constants_1.DATABASE_DEFAULT_USERNAME,
    password: process.env.DB_PASSWORD ?? constants_1.DATABASE_DEFAULT_PASSWORD,
    dbName: process.env.DB_NAME ?? constants_1.DATABASE_DEFAULT_NAME,
    migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
    },
    seeder: {
        defaultSeeder: 'DatabaseSeeder',
        path: 'dist/seeders/',
        pathTs: 'src/seeders',
    },
    extensions: [migrations_1.Migrator, seeder_1.SeedManager],
    driver: postgresql_1.PostgreSqlDriver,
});
//# sourceMappingURL=mikro-orm.config.js.map