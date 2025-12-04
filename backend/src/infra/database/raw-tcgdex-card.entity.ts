import { Entity, ManyToOne, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { TcgCard } from './tcg-card.entity';
import { CardFinishType, CardArtVariant } from './types';

@Entity({ tableName: 'raw_tcgdex_cards' })
export class RawTcgdexCard {}
