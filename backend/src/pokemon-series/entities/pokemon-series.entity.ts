import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PokemonSet } from 'src/pokemon-set/entities/pokemon-set.entity';

export const POKEMON_SERIES_TABLE_NAME = 'pokemon_series';

@Table({
  tableName: POKEMON_SERIES_TABLE_NAME,
})
export class PokemonSeries extends Model {
  @Column({
    type: DataType.TEXT,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare seriesId: string;

  @Column({
    type: DataType.TEXT,
  })
  declare logo: string;

  @HasMany(() => PokemonSet)
  declare sets: PokemonSet[];
}
