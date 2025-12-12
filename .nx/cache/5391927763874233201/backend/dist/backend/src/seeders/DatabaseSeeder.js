"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const seeder_1 = require("@mikro-orm/seeder");
const TcgGamesSeeder_1 = require("./TcgGamesSeeder");
class DatabaseSeeder extends seeder_1.Seeder {
    run(em) {
        return this.call(em, [TcgGamesSeeder_1.TcgGamesSeeder]);
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
//# sourceMappingURL=DatabaseSeeder.js.map