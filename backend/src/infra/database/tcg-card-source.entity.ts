/* ============================
 * TcgCardSource (mapping to each external provider)
 * Must be defined before TcgplayerProduct to avoid forward reference issues
 * ============================
 */

import {
  Entity,
  ManyToOne,
  Enum,
  Property,
  OneToOne,
  PrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { TcgCard } from './tcg-card.entity';
import { TcgplayerProduct } from './tcgplayer-product.entity';
import { CardSourceType } from './types';

@Entity({ tableName: 'tcg_card_sources' })
@Unique({ properties: ['source', 'sourceCardId'] })
export class TcgCardSource {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => TcgCard)
  card!: TcgCard;

  @Enum(() => CardSourceType)
  source!: CardSourceType; // tcgplayer / tcgdex / pokemon_tcg_data ...

  @Property()
  sourceCardId!: string; // e.g. TCGplayer productId, tcgdex id, etc.

  @Property({ nullable: true })
  sourceSetCode?: string; // provider-specific set code

  @Property({ nullable: true })
  sourceSetName?: string; // provider-specific set name

  @Property({ nullable: true })
  sourceName?: string; // provider-specific card name

  @Property({ type: 'json', nullable: true })
  rawExtra?: Record<string, any>; // provider-specific JSON blob (raw fields)

  @Property({ default: false })
  isPrimary!: boolean; // your chosen primary mapping for that source

  @OneToOne(() => TcgplayerProduct, (product) => product.cardSource, {
    nullable: true,
  })
  tcgplayerProduct?: TcgplayerProduct;
}
