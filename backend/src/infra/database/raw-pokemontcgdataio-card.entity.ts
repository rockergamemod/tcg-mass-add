import { Entity, ManyToOne, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { TcgCard } from './tcg-card.entity';

@Entity({ tableName: 'raw_pokemontcgdataio_cards' })
export class RawPokemontcgdataioCard {}
