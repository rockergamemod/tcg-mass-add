import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
export declare class TcgGamesSeeder extends Seeder {
    run(em: EntityManager): Promise<void>;
}
