import { SeriesService } from './series.service';
import { GameKey } from 'src/infra/database/types';
export declare class SeriesController {
    private readonly pokemonSeriesService;
    constructor(pokemonSeriesService: SeriesService);
    findAll(gameKey: GameKey): Promise<import("@mikro-orm/core").Loaded<import("../infra/database/tcg-series.entity").TcgSeries, "sets" | "game", "*", never>[]>;
    findOne(id: string): string;
}
