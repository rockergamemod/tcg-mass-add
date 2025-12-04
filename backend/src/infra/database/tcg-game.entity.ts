/* ============================
 * TcgGame (per game/product line)
 * ============================
 */

import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { GameKey } from './types';
import { TcgSet } from './tcg-set.entity';

@Entity({ tableName: 'tcg_games' })
export class TcgGame {
  @PrimaryKey()
  id!: number; // Simple numeric PK; switch to UUID if you prefer

  @Enum(() => GameKey)
  key!: GameKey; // e.g. 'pokemon'

  @Property()
  name!: string; // e.g. 'Pokémon TCG'

  @OneToMany(() => TcgSet, (set) => set.game)
  sets = new Collection<TcgSet>(this);
}
