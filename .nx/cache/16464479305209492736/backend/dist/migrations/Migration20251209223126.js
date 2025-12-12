"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251209223126 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251209223126 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "tcg_card_printings" add column "source_id" int null;`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_source_id_foreign" foreign key ("source_id") references "tcg_card_sources" ("id") on update cascade on delete set null;`);
    }
    async down() {
        this.addSql(`alter table "tcg_card_printings" drop constraint "tcg_card_printings_source_id_foreign";`);
        this.addSql(`alter table "tcg_card_printings" drop column "source_id";`);
    }
}
exports.Migration20251209223126 = Migration20251209223126;
//# sourceMappingURL=Migration20251209223126.js.map