import { CardService } from './card.service';
import { GameKey } from 'src/infra/database/types';
export declare class CardController {
    private readonly pokemonCardService;
    constructor(pokemonCardService: CardService);
    findAll(gameKey: GameKey, seriesId: number, setId: number, limit?: number, page?: number): Promise<import("@mikro-orm/core").Loaded<import("../infra/database").TcgCard, "set" | "printings" | "sources", "*" | "sources.sourceSetCode" | "sources.sourceName" | "set.*" | "printings.*" | "printings.source.id", never>[]>;
    findOne(gameKey: GameKey, seriesId: number, setId: number, cardId: number): Promise<import("@mikro-orm/core").Loaded<import("../infra/database").TcgCard, "set" | "printings", "*", never> | null>;
}
