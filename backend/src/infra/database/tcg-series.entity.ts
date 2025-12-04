// tcg-series.entity.ts
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
} from '@mikro-orm/core';
import { TcgGame } from './tcg-game.entity';
import { TcgSet } from './tcg-set.entity';

@Entity({ tableName: 'tcg_series' })
@Unique({ properties: ['game', 'code'] })
export class TcgSeries {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => TcgGame)
  game!: TcgGame; // e.g. 'pokemon'

  @Property()
  code!: string; // e.g. 'sv', 'swsh', 'sm', 'xy'

  @Property()
  name!: string; // e.g. 'Scarlet & Violet'

  @Property({ nullable: true })
  logo!: string | undefined;

  // You can use this to sort series in your UI (lower = earlier)
  @Property({ nullable: true })
  displayOrder?: number;

  // If you want to hide older/edge series from normal navigation
  @Property({ default: false })
  isHidden!: boolean;

  @OneToMany(() => TcgSet, (set) => set.series)
  sets = new Collection<TcgSet>(this);
}
