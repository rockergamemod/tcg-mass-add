"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251209180739 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251209180739 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_art_variant_check";`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_art_variant_check" check("art_variant" in ('normal', 'illustration-rare', 'special-illustration-rare', 'alt-art', 'alt-full-art', 'alt-art-secret', 'poke-ball', 'master-ball', 'secret'));`);
    }
    async down() {
        this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_art_variant_check";`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_art_variant_check" check("art_variant" in ('normal', 'illustration-rare', 'special-illustration-rare', 'alt-art', 'poke-ball', 'master-ball'));`);
    }
}
exports.Migration20251209180739 = Migration20251209180739;
//# sourceMappingURL=Migration20251209180739.js.map