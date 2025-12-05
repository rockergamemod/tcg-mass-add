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
  @PrimaryKey({ type: 'serial', autoincrement: true })
  id!: number;

  // The numeric product ID from TCGplayer (if your CSV has it as number; use string if not)
  @Property({ type: 'number' })
  tcgplayerProductId!: number;

  // The card-source row for this product; this should have source = 'tcgplayer'
  @OneToOne(() => TcgCardSource, (source) => source.tcgplayerProduct, {
    owner: true,
  })
  cardSource!: TcgCardSource;

  @Property({ type: 'string' })
  productLine!: string; // e.g. 'Pokémon'

  @Property({ type: 'string' })
  productName!: string; // EXACT TCGplayer name, e.g. 'Gloom - 198/197'

  @Property({ type: 'string' })
  setName!: string; // 'Obsidian Flames'

  @Property({ type: 'string' })
  setCode!: string; // 'OBF' - the one you need for Mass Entry

  @Property({ type: 'string' })
  collectorNumber!: string; // '060', '198/197', etc.

  @Property({ type: 'string', nullable: true })
  rarity?: string;

  @Property({ type: 'string', default: true })
  isActive!: boolean;

  @Property({ type: 'string', nullable: true })
  lastSeenAt?: Date; // updated when you re-import CSV
}
