import { EntityRepository } from '@mikro-orm/postgresql';
import { TcgSeries } from 'src/infra/database/tcg-series.entity';
import { GameKey } from 'src/infra/database/types';
export declare class SeriesService {
    private readonly pokemonSeriesRepo;
    constructor(pokemonSeriesRepo: EntityRepository<TcgSeries>);
    findAll(gameKey: GameKey): Promise<import("@mikro-orm/postgresql").Loaded<TcgSeries, "sets" | "game", "*", never>[]>;
    findOne(id: number): string;
}
