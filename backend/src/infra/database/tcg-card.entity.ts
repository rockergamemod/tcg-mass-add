import {
  Entity,
  ManyToOne,
  Property,
  OneToMany,
  Collection,
  Unique,
  PrimaryKey,
} from '@mikro-orm/core';
import { TcgCardPrinting } from './tcg-card-printing.entity';
import { TcgCardSource } from './tcg-card-source.entity';
import { TcgSet } from './tcg-set.entity';

@Entity({ tableName: 'tcg_cards' })
@Unique({ properties: ['set', 'collectorNumber'] })
export class TcgCard {
  @PrimaryKey({ type: 'serial', autoincrement: true })
  id!: number;

  @ManyToOne(() => TcgSet)
  set!: TcgSet;

  @Property({ type: 'string' })
  collectorNumber!: string; // e.g. '060', '198/197'

  @Property({ type: 'string' })
  canonicalName!: string; // Your normalized display name, e.g. 'Gloom'

  @Property({ type: 'string', nullable: true })
  rarity?: string;

  @Property({ type: 'string', nullable: true })
  supertype?: string; // e.g. 'Pokémon'

  @Property({ type: 'string', nullable: true })
  subtype?: string; // e.g. 'Stage 1'\

  @Property({ type: 'string', nullable: true })
  image?: string;

  @OneToMany(() => TcgCardPrinting, (printing) => printing.card)
  printings = new Collection<TcgCardPrinting>(this);

  @OneToMany(() => TcgCardSource, (source) => source.card)
  sources = new Collection<TcgCardSource>(this);
}
