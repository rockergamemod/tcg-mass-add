import { Migration } from '@mikro-orm/migrations';

export class Migration20251208202225 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tcg_series" add column "release_date" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tcg_series" drop column "release_date";`);
  }

}
