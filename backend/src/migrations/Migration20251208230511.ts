import { Migration } from '@mikro-orm/migrations';

export class Migration20251208230511 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tcg_cards" add column "image" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tcg_cards" drop column "image";`);
  }

}
