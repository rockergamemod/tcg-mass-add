import 'reflect-metadata';
import { EntityManager } from '@mikro-orm/core';
import TCGdex from '@tcgdex/sdk';
import { TcgCard, TcgSet } from 'src/infra/database';
import { TcgSeries } from 'src/infra/database/tcg-series.entity';
export declare function loadTcgDexSeries(em: EntityManager, tcgdex: TCGdex, options: {
    shouldSkipSeries: boolean;
}): Promise<TcgSeries[]>;
export declare function loadTcgDexSetsForSeries(em: EntityManager, tcgdex: TCGdex, series: TcgSeries, options: {
    shouldSkipSets: boolean;
}): Promise<TcgSet[]>;
export declare function loadTcgDexCardsForSet(em: EntityManager, tcgdex: TCGdex, set: TcgSet, options: {
    shouldSkipCards: boolean;
}): Promise<TcgCard[]>;
