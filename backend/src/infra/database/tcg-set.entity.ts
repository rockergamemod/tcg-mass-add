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
@Unique({ properties: ['game', 'code', 'series'] })
export class TcgSet {
  @PrimaryKey({ type: 'serial', autoincrement: true })
  id!: number;

  @ManyToOne(() => TcgGame)
  game!: TcgGame;

  @Property({ type: 'string', nullable: true })
  code!: string | undefined; // Your canonical code, e.g. 'sv3', 'OBF'

  @ManyToOne(() => TcgSeries, { nullable: true })
  series?: TcgSeries; // null for edge cases / TCGplayer-only sets

  @Property({ type: 'string' })
  name!: string; // 'Obsidian Flames'

  @Property({ type: 'string', nullable: true })
  releaseDate?: Date;

  @Property({ type: 'bool', default: true })
  isUserVisible!: boolean;

  @Property({ type: 'string', nullable: true })
  logo!: string | undefined;

  @Enum(() => TcgSetType)
  type!: TcgSetType; // main / promo / deck / virtual ...

  @OneToMany(() => TcgCard, (card) => card.set)
  cards = new Collection<TcgCard>(this);
}
