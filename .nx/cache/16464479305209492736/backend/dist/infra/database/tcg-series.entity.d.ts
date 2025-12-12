import { Collection } from '@mikro-orm/core';
import { TcgGame } from './tcg-game.entity';
import { TcgSet } from './tcg-set.entity';
export declare class TcgSeries {
    id: number;
    game: TcgGame;
    code: string;
    name: string;
    logo: string | undefined;
    displayOrder?: number;
    isHidden: boolean;
    releaseDate: string;
    sets: Collection<TcgSet, object>;
}
