import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PokemonCard } from 'src/pokemon-card/entities/pokemon-card.entity';
import { PokemonSeries } from 'src/pokemon-series/entities/pokemon-series.entity';

@Table({
  tableName: 'pokemon_sets',
})
export class PokemonSet extends Model {
  @Column({
    type: DataType.TEXT,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare printedTotal: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare total: number;

  @Column({
    type: DataType.TEXT,
  })
  declare ptcgoCode: string;

  @Column({
    type: DataType.TEXT,
  })
  declare releaseDate: string;

  @Column({
    type: DataType.TEXT,
  })
  declare symbolImage: string;

  @Column({
    type: DataType.TEXT,
  })
  declare logoImage: string;

  @HasMany(() => PokemonCard)
  declare cards: PokemonCard[];

  @ForeignKey(() => PokemonSeries)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare seriesId: number;

  @BelongsTo(() => PokemonSeries)
  declare series: PokemonSeries;
}
