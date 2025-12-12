"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251208202225 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251208202225 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "tcg_series" add column "release_date" varchar(255) null;`);
    }
    async down() {
        this.addSql(`alter table "tcg_series" drop column "release_date";`);
    }
}
exports.Migration20251208202225 = Migration20251208202225;
//# sourceMappingURL=Migration20251208202225.js.map