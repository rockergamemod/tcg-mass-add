import { Collection } from '@mikro-orm/core';
import { TcgCardPrinting } from './tcg-card-printing.entity';
import { TcgCardSource } from './tcg-card-source.entity';
import { TcgSet } from './tcg-set.entity';
export declare class TcgCard {
    id: number;
    set: TcgSet;
    collectorNumber: string;
    canonicalName: string;
    rarity?: string;
    supertype?: string;
    subtype?: string;
    image?: string;
    imageHigh?: string;
    printings: Collection<TcgCardPrinting, object>;
    sources: Collection<TcgCardSource, object>;
}
