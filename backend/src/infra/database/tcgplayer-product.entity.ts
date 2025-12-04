import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TcgCardSource } from './tcg-card-source.entity';

@Entity({ tableName: 'tcgplayer_products' })
@Unique({ properties: ['tcgplayerProductId'] })
export class TcgplayerProduct {
  @PrimaryKey()
  id!: number;

  // The numeric product ID from TCGplayer (if your CSV has it as number; use string if not)
  @Property()
  tcgplayerProductId!: number;

  // The card-source row for this product; this should have source = 'tcgplayer'
  @OneToOne(() => TcgCardSource, (source) => source.tcgplayerProduct, {
    owner: true,
  })
  cardSource!: TcgCardSource;

  @Property()
  productLine!: string; // e.g. 'Pokémon'

  @Property()
  productName!: string; // EXACT TCGplayer name, e.g. 'Gloom - 198/197'

  @Property()
  setName!: string; // 'Obsidian Flames'

  @Property()
  setCode!: string; // 'OBF' - the one you need for Mass Entry

  @Property()
  collectorNumber!: string; // '060', '198/197', etc.

  @Property({ nullable: true })
  rarity?: string;

  @Property({ default: true })
  isActive!: boolean;

  @Property({ nullable: true })
  lastSeenAt?: Date; // updated when you re-import CSV
}
