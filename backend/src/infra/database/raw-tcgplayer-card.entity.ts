import { Entity, ManyToOne, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { TcgCard } from './tcg-card.entity';

@Entity({ tableName: 'raw_tcgplayer_cards' })
export class RawTcgplayerCard {}
