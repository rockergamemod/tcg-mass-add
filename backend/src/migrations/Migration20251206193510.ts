import { Migration } from '@mikro-orm/migrations';

export class Migration20251206193510 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_finish_type_check";`);

    this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_finish_type_check" check("finish_type" in ('normal', 'holofoil', 'reverse-holo', 'unlimited', 'unlimited-holo', '1st-edition', '1st-edition-holo'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tcg_card_printings" drop constraint if exists "tcg_card_printings_finish_type_check";`);

    this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_finish_type_check" check("finish_type" in ('normal', 'holofoil', 'reverse-holo'));`);
  }

}
