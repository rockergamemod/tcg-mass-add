import { EntityRepository } from '@mikro-orm/postgresql';
import { TcgCard } from 'src/infra/database';
import { GameKey } from 'src/infra/database/types';
export declare class CardService {
    private cardRepo;
    constructor(cardRepo: EntityRepository<TcgCard>);
    findAll(gameKey: GameKey, seriesId: number, setId: number, options?: {
        page: number;
        limit: number;
    }): Promise<import("@mikro-orm/postgresql").Loaded<TcgCard, "set" | "printings" | "sources", "*" | "sources.sourceSetCode" | "sources.sourceName" | "set.*" | "printings.*" | "printings.source.id", never>[]>;
    findOne(gameKey: GameKey, seriesId: number, setId: number, cardId: number): Promise<import("@mikro-orm/postgresql").Loaded<TcgCard, "set" | "printings", "*", never> | null>;
}
