"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251206193510 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251206193510 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_finish_type_check";`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_finish_type_check" check("finish_type" in ('normal', 'holofoil', 'reverse-holo', 'unlimited', 'unlimited-holo', '1st-edition', '1st-edition-holo'));`);
    }
    async down() {
        this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_finish_type_check";`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_finish_type_check" check("finish_type" in ('normal', 'holofoil', 'reverse-holo'));`);
    }
}
exports.Migration20251206193510 = Migration20251206193510;
//# sourceMappingURL=Migration20251206193510.js.map