import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { TcgGame } from '../infra/database';
import { GameKey } from '../infra/database/types';

export class TcgGamesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // TODO: Add all supported games (later)
    const pokemon = em.create(TcgGame, {
      key: GameKey.Pokemon,
      name: 'Pokémon TCG',
    });

    em.persist(pokemon);
  }
}
