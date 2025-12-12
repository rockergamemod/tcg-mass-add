import { EntityRepository } from '@mikro-orm/postgresql';
import { TcgSet } from 'src/infra/database';
import { GameKey } from 'src/infra/database/types';
export declare class SetService {
    private readonly tcgSetRepo;
    constructor(tcgSetRepo: EntityRepository<TcgSet>);
    findAll(gameKey: GameKey, seriesId: number): Promise<import("@mikro-orm/postgresql").Loaded<TcgSet, "game" | "series", "*", never>[]>;
    findOne(gameKey: GameKey, seriesId: number, setId: number): Promise<import("@mikro-orm/postgresql").Loaded<TcgSet, "series" | "cards", "*", never> | null>;
}
