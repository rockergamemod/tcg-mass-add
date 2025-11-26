import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PokemonSet } from 'src/pokemon-set/entities/pokemon-set.entity';

@Table({
  tableName: 'pokemon_sets',
})
export class PokemonSeries extends Model {
  @Column({
    type: DataType.TEXT,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare logoImage: string;

  @HasMany(() => PokemonSet)
  declare sets: PokemonSet[];
}
