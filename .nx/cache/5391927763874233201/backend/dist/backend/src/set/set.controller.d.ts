import { SetService } from './set.service';
import { GameKey } from 'src/infra/database/types';
export declare class SetController {
    private readonly pokemonSetService;
    constructor(pokemonSetService: SetService);
    findAll(gameKey: GameKey, seriesId: number): Promise<import("@mikro-orm/core").Loaded<import("../infra/database").TcgSet, "game" | "series", "*", never>[]>;
    findOne(gameKey: GameKey, seriesId: number, setId: number): Promise<import("@mikro-orm/core").Loaded<import("../infra/database").TcgSet, "series" | "cards", "*", never> | null>;
}
