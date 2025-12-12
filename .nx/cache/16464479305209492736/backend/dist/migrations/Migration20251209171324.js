"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251209171324 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251209171324 extends migrations_1.Migration {
    async up() {
        this.addSql(`drop table if exists "tcgplayer_products" cascade;`);
        this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_art_variant_check";`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_art_variant_check" check("art_variant" in ('normal', 'illustration-rare', 'special-illustration-rare', 'alt-art', 'poke-ball', 'master-ball'));`);
    }
    async down() {
        this.addSql(`create table "tcgplayer_products" ("id" serial primary key, "tcgplayer_product_id" int not null, "card_source_id" int not null, "product_line" varchar(255) not null, "product_name" varchar(255) not null, "set_name" varchar(255) not null, "set_code" varchar(255) not null, "collector_number" varchar(255) not null, "rarity" varchar(255) null, "is_active" varchar(255) not null default true, "last_seen_at" varchar(255) null);`);
        this.addSql(`alter table "tcgplayer_products" add constraint "tcgplayer_products_card_source_id_unique" unique ("card_source_id");`);
        this.addSql(`alter table "tcgplayer_products" add constraint "tcgplayer_products_tcgplayer_product_id_unique" unique ("tcgplayer_product_id");`);
        this.addSql(`alter table "tcgplayer_products" add constraint "tcgplayer_products_card_source_id_foreign" foreign key ("card_source_id") references "tcg_card_sources" ("id") on update cascade;`);
        this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_art_variant_check";`);
        this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_art_variant_check" check("art_variant" in ('normal', 'illustration_rare', 'alt_art'));`);
    }
}
exports.Migration20251209171324 = Migration20251209171324;
//# sourceMappingURL=Migration20251209171324.js.map