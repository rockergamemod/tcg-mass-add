"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251211161343 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251211161343 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "tcg_cards" add column "image_high" varchar(255) null;`);
    }
    async down() {
        this.addSql(`alter table "tcg_cards" drop column "image_high";`);
    }
}
exports.Migration20251211161343 = Migration20251211161343;
//# sourceMappingURL=Migration20251211161343.js.map