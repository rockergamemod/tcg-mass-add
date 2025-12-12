"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcgGamesSeeder = void 0;
const seeder_1 = require("@mikro-orm/seeder");
const database_1 = require("../infra/database");
const types_1 = require("../infra/database/types");
class TcgGamesSeeder extends seeder_1.Seeder {
    async run(em) {
        const pokemon = em.create(database_1.TcgGame, {
            key: types_1.GameKey.Pokemon,
            name: 'Pokemon',
        });
        em.persist(pokemon);
    }
}
exports.TcgGamesSeeder = TcgGamesSeeder;
//# sourceMappingURL=TcgGamesSeeder.js.map