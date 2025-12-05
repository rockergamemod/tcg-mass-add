// tcg-set-source.entity.ts
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  Enum,
} from '@mikro-orm/core';
import { TcgSet } from './tcg-set.entity';
import { CardSourceType } from './types';

@Entity({ tableName: 'tcg_set_sources' })
@Unique({ properties: ['source', 'sourceSetId'] })
export class TcgSetSource {
  @PrimaryKey({ type: 'serial', autoincrement: true })
  id!: number;

  @ManyToOne(() => TcgSet)
  set!: TcgSet;

  @Enum(() => CardSourceType)
  source!: CardSourceType; // tcgplayer / tcgdex / pokemon_tcg_data / ...

  // Provider's "set id" — could be TCGplayer groupId, tcgdex set id, etc.
  @Property({ type: 'string' })
  sourceSetId!: string;

  @Property({ type: 'string', nullable: true })
  sourceSetCode?: string; // provider-specific set code (e.g. 'OBF', 'SV3')

  @Property({ type: 'string', nullable: true })
  sourceSetName?: string; // provider-specific set name (e.g. 'Deck Exclusives')

  @Property({ type: 'json', nullable: true })
  rawExtra?: Record<string, any>;

  @Property({ type: 'bool', default: true })
  isPrimary!: boolean;
}
