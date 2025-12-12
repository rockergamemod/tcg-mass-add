"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251208230511 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251208230511 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "tcg_cards" add column "image" varchar(255) null;`);
    }
    async down() {
        this.addSql(`alter table "tcg_cards" drop column "image";`);
    }
}
exports.Migration20251208230511 = Migration20251208230511;
//# sourceMappingURL=Migration20251208230511.js.map