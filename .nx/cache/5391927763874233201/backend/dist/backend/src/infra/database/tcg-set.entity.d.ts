import { Collection } from '@mikro-orm/core';
import { TcgGame } from './tcg-game.entity';
import { TcgCard } from './tcg-card.entity';
import { TcgSeries } from './tcg-series.entity';
import { TcgSetType } from './types';
export declare class TcgSet {
    id: number;
    game: TcgGame;
    code: string | undefined;
    series?: TcgSeries;
    name: string;
    releaseDate?: Date;
    isUserVisible: boolean;
    logo: string | undefined;
    type: TcgSetType;
    cards: Collection<TcgCard, object>;
}
