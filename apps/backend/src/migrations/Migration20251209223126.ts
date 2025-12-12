import { Migration } from '@mikro-orm/migrations';

export class Migration20251209223126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tcg_card_printings" add column "source_id" int null;`);
    this.addSql(`alter table "tcg_card_printings" add constraint "tcg_card_printings_source_id_foreign" foreign key ("source_id") references "tcg_card_sources" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tcg_card_printings" drop constraint "tcg_card_printings_source_id_foreign";`);

    this.addSql(`alter table "tcg_card_printings" drop column "source_id";`);
  }

}
