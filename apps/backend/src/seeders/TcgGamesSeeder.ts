import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { TcgGame, GameKey } from '@repo/shared-types';

export class TcgGamesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // TODO: Add all supported games (later)
    const pokemon = em.create(TcgGame, {
      key: GameKey.Pokemon,
      name: 'Pokemon',
    });

    em.persist(pokemon);
  }
}
