import { Migration } from '@mikro-orm/migrations';

export class Migration20251209180739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_art_variant_check";`);

    this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_art_variant_check" check("art_variant" in ('normal', 'illustration-rare', 'special-illustration-rare', 'alt-art', 'alt-full-art', 'alt-art-secret', 'poke-ball', 'master-ball', 'secret'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_art_variant_check";`);

    this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_art_variant_check" check("art_variant" in ('normal', 'illustration-rare', 'special-illustration-rare', 'alt-art', 'poke-ball', 'master-ball'));`);
  }

}
