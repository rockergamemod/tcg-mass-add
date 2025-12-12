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
  PrimaryKey,
  Unique,
  EntityDTO,
} from '@mikro-orm/core';

import { CardSourceType } from '../enums';
import { TcgCard } from './tcg-card.entity';

@Entity({ tableName: 'tcg_card_sources' })
@Unique({ properties: ['source', 'sourceCardId'] })
export class TcgCardSource {
  @PrimaryKey({ type: 'serial', autoincrement: true })
  id!: number;

  @ManyToOne(() => TcgCard)
  card!: TcgCard;

  @Enum(() => CardSourceType)
  source!: CardSourceType; // tcgplayer / tcgdex / pokemon_tcg_data ...

  @Property({ type: 'string' })
  sourceCardId!: string; // e.g. TCGplayer productId, tcgdex id, etc.

  @Property({ type: 'string', nullable: true })
  sourceSetCode?: string; // provider-specific set code

  @Property({ type: 'string', nullable: true })
  sourceSetName?: string; // provider-specific set name

  @Property({ type: 'string', nullable: true })
  sourceName?: string; // provider-specific card name

  @Property({ type: 'json', nullable: true })
  rawExtra?: Record<string, any>; // provider-specific JSON blob (raw fields)

  @Property({ type: 'bool', default: false })
  isPrimary!: boolean; // your chosen primary mapping for that source
}

export type TcgCardSourceDto = EntityDTO<TcgCardSource>;
