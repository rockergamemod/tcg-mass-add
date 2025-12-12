import { Collection } from '@mikro-orm/core';
import { GameKey } from './types';
import { TcgSet } from './tcg-set.entity';
export declare class TcgGame {
    id: number;
    key: GameKey;
    name: string;
    sets: Collection<TcgSet, object>;
}
