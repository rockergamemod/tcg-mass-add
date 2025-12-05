/* ============================
 * TcgCardPrinting (normal vs reverse holo, alt art, etc.)
 * ============================
 */

import { Entity, ManyToOne, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { TcgCard } from './tcg-card.entity';
import { CardFinishType, CardArtVariant } from './types';

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
}
