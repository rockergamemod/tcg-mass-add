/* ============================
 * TcgSet (per set/expansion)
 * ============================
 */

import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TcgGame } from './tcg-game.entity';
import { TcgCard } from './tcg-card.entity';
import { TcgSeries } from './tcg-series.entity';
import { TcgSetType } from './types';

@Entity({ tableName: 'tcg_sets' })
@Unique({ properties: ['game', 'code'] })
export class TcgSet {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => TcgGame)
  game!: TcgGame;

  @Property()
  code!: string; // Your canonical code, e.g. 'sv3', 'OBF'

  @ManyToOne(() => TcgSeries, { nullable: true })
  series?: TcgSeries; // null for edge cases / TCGplayer-only sets

  @Property()
  name!: string; // 'Obsidian Flames'

  @Property({ nullable: true })
  releaseDate?: Date;

  @Property({ default: true })
  isUserVisible!: boolean;

  @Property({ nullable: true })
  logo!: string | undefined;

  @Enum(() => TcgSetType)
  type!: TcgSetType; // main / promo / deck / virtual ...

  @OneToMany(() => TcgCard, (card) => card.set)
  cards = new Collection<TcgCard>(this);
}
