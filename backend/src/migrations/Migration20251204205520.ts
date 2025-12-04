import { Migration } from '@mikro-orm/migrations';

export class Migration20251204205520 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tcg_games" ("id" serial primary key, "key" text check ("key" in ('pokemon')) not null, "name" varchar(255) not null);`);

    this.addSql(`create table "tcg_series" ("id" serial primary key, "game_id" int not null, "code" varchar(255) not null, "name" varchar(255) not null, "logo" varchar(255) null, "display_order" int null, "is_hidden" boolean not null default false);`);
    this.addSql(`alter table "tcg_series" add constraint "tcg_series_game_id_code_unique" unique ("game_id", "code");`);

    this.addSql(`create table "tcg_sets" ("id" serial primary key, "game_id" int not null, "code" varchar(255) not null, "series_id" int null, "name" varchar(255) not null, "release_date" timestamptz null, "is_user_visible" boolean not null default true, "logo" varchar(255) null, "type" text check ("type" in ('main', 'mini', 'promo', 'deck', 'box', 'virtual', 'other')) not null);`);
    this.addSql(`alter table "tcg_sets" add constraint "tcg_sets_game_id_code_unique" unique ("game_id", "code");`);

    this.addSql(`create table "tcg_cards" ("id" serial primary key, "set_id" int not null, "collector_number" varchar(255) not null, "canonical_name" varchar(255) not null, "rarity" varchar(255) null, "supertype" varchar(255) null, "subtype" varchar(255) null);`);
    this.addSql(`alter table "tcg_cards" add constraint "tcg_cards_set_id_collector_number_unique" unique ("set_id", "collector_number");`);

    this.addSql(`create table "tcg_card_sources" ("id" serial primary key, "card_id" int not null, "source" text check ("source" in ('tcgplayer', 'tcgdex', 'pokemon_tcg_data')) not null, "source_card_id" varchar(255) not null, "source_set_code" varchar(255) null, "source_set_name" varchar(255) null, "source_name" varchar(255) null, "raw_extra" jsonb null, "is_primary" boolean not null default false);`);
    this.addSql(`alter table "tcg_card_sources" add constraint "tcg_card_sources_source_source_card_id_unique" unique ("source", "source_card_id");`);

    this.addSql(`create table "tcgplayer_products" ("id" serial primary key, "tcgplayer_product_id" int not null, "card_source_id" int not null, "product_line" varchar(255) not null, "product_name" varchar(255) not null, "set_name" varchar(255) not null, "set_code" varchar(255) not null, "collector_number" varchar(255) not null, "rarity" varchar(255) null, "is_active" boolean not null default true, "last_seen_at" timestamptz null);`);
    this.addSql(`alter table "tcgplayer_products" add constraint "tcgplayer_products_card_source_id_unique" unique ("card_source_id");`);
    this.addSql(`alter table "tcgplayer_products" add constraint "tcgplayer_products_tcgplayer_product_id_unique" unique ("tcgplayer_product_id");`);

    this.addSql(`create table "tcg_card_printings" ("id" serial primary key, "card_id" int not null, "finish_type" text check ("finish_type" in ('non_holo', 'holo', 'reverse_holo')) not null, "art_variant" text check ("art_variant" in ('normal', 'illustration_rare', 'alt_art')) null, "is_default" boolean not null default true);`);

    this.addSql(`create table "tcg_set_sources" ("id" serial primary key, "set_id" int not null, "source" text check ("source" in ('tcgplayer', 'tcgdex', 'pokemon_tcg_data')) not null, "source_set_id" varchar(255) not null, "source_set_code" varchar(255) null, "source_set_name" varchar(255) null, "raw_extra" jsonb null, "is_primary" boolean not null default true);`);
    this.addSql(`alter table "tcg_set_sources" add constraint "tcg_set_sources_source_source_set_id_unique" unique ("source", "source_set_id");`);

    this.addSql(`alter table "tcg_series" add constraint "tcg_series_game_id_foreign" foreign key ("game_id") references "tcg_games" ("id") on update cascade;`);

    this.addSql(`alter table "tcg_sets" add constraint "tcg_sets_game_id_foreign" foreign key ("game_id") references "tcg_games" ("id") on update cascade;`);
    this.addSql(`alter table "tcg_sets" add constraint "tcg_sets_series_id_foreign" foreign key ("series_id") references "tcg_series" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "tcg_cards" add constraint "tcg_cards_set_id_foreign" foreign key ("set_id") references "tcg_sets" ("id") on update cascade;`);

    this.addSql(`alter table "tcg_card_sources" add constraint "tcg_card_sources_card_id_foreign" foreign key ("card_id") references "tcg_cards" ("id") on update cascade;`);

    this.addSql(`alter table "tcgplayer_products" add constraint "tcgplayer_products_card_source_id_foreign" foreign key ("card_source_id") references "tcg_card_sources" ("id") on update cascade;`);

    this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_card_id_foreign" foreign key ("card_id") references "tcg_cards" ("id") on update cascade;`);

    this.addSql(`alter table "tcg_set_sources" add constraint "tcg_set_sources_set_id_foreign" foreign key ("set_id") references "tcg_sets" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tcg_series" drop constraint "tcg_series_game_id_foreign";`);

    this.addSql(`alter table "tcg_sets" drop constraint "tcg_sets_game_id_foreign";`);

    this.addSql(`alter table "tcg_sets" drop constraint "tcg_sets_series_id_foreign";`);

    this.addSql(`alter table "tcg_cards" drop constraint "tcg_cards_set_id_foreign";`);

    this.addSql(`alter table "tcg_set_sources" drop constraint "tcg_set_sources_set_id_foreign";`);

    this.addSql(`alter table "tcg_card_sources" drop constraint "tcg_card_sources_card_id_foreign";`);

    this.addSql(`alter table "tcg_card_printings" drop constraint "tcg_card_printings_card_id_foreign";`);

    this.addSql(`alter table "tcgplayer_products" drop constraint "tcgplayer_products_card_source_id_foreign";`);

    this.addSql(`drop table if exists "tcg_games" cascade;`);

    this.addSql(`drop table if exists "tcg_series" cascade;`);

    this.addSql(`drop table if exists "tcg_sets" cascade;`);

    this.addSql(`drop table if exists "tcg_cards" cascade;`);

    this.addSql(`drop table if exists "tcg_card_sources" cascade;`);

    this.addSql(`drop table if exists "tcgplayer_products" cascade;`);

    this.addSql(`drop table if exists "tcg_card_printings" cascade;`);

    this.addSql(`drop table if exists "tcg_set_sources" cascade;`);
  }

}
