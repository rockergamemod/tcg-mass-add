import {
  Collection,
  Entity,
  EntityDTO,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { GameKey } from '../enums';
import { TcgSet } from './tcg-set.entity';

@Entity({ tableName: 'tcg_games' })
export class TcgGame {
  @PrimaryKey({ type: 'serial', autoincrement: true })
  id!: number; // Simple numeric PK; switch to UUID if you prefer

  @Enum(() => GameKey)
  key!: GameKey; // e.g. 'pokemon'

  @Property({ type: 'string' })
  name!: string; // e.g. 'Pokémon TCG'

  @OneToMany(() => TcgSet, (set) => set.game)
  sets = new Collection<TcgSet>(this);
}

export type TcgGameDto = EntityDTO<TcgGame>;
