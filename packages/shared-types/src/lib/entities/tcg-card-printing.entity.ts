/* ============================
 * TcgCardPrinting (normal vs reverse holo, alt art, etc.)
 * ============================
 */

import {
  Entity,
  ManyToOne,
  Enum,
  Property,
  PrimaryKey,
  EntityDTO,
} from '@mikro-orm/core';
import { CardFinishType, CardArtVariant } from '../enums';
import { TcgCardSource } from './tcg-card-source.entity';
import { TcgCard } from './tcg-card.entity';

@Entity({ tableName: 'tcg_card_printings' })
export class TcgCardPrinting {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number;

  @ManyToOne(() => TcgCard)
  card!: TcgCard;

  @Enum(() => CardFinishType)
  finishType!: CardFinishType; // non_holo / reverse_holo / holo, etc.

  @Enum({ items: () => CardArtVariant, nullable: true })
  artVariant?: CardArtVariant; // normal / illustration_rare / alt_art ...

  @Property({ default: true, type: 'bool' })
  isDefault!: boolean; // which printing you treat as the default in your UI

  @ManyToOne(() => TcgCardSource, { nullable: true })
  source?: TcgCardSource;
}

export type TcgCardPrintingDto = EntityDTO<TcgCardPrinting>;
