import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { PokemonSet } from 'src/pokemon-set/entities/pokemon-set.entity';

export const Printing = ['normal', 'holo', 'reverse'] as const;
export type PrintingType = (typeof Printing)[number];
export const Rarity = [
  'Promo',
  'Common',
  'Rare',
  'Holo Rare',
  'Uncommon',
  'Secret Rare',
  'Ultra Rare',
  'Shiny Holo Rare',
  'Code Card',
  'Unconfirmed',
  'Rare Ace',
  'Classic Collection',
  'Radiant Rare',
  'Prism Rare',
  'Double Rare',
  'Illustration Rare',
  'Special Illustration Rare',
  'Mega Hyper Rare',
  'ACE SPEC Rare',
  'Amazing Rare',
  'Black White Rare',
  'Shiny Rare',
  'Shiny Ultra Rare',
  'Hyper Rare',
  'Rare BREAK',
] as const;
export type RarityType = (typeof Rarity)[number];

@Table({
  tableName: 'pokemon_cards',
})
export class PokemonCard extends Model {
  @Column({
    type: DataType.ENUM(...Printing),
    allowNull: false,
  })
  declare printing: PrintingType;

  @Column({
    type: DataType.ENUM(...Rarity),
    allowNull: false,
  })
  declare rarity: RarityType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare number: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => PokemonSet)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare setId: number;

  @BelongsTo(() => PokemonSet)
  declare pokemonSet: PokemonSet;
}
