// scripts/import-tcgplayer-csv.ts
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import TCGdex from '@tcgdex/sdk';

import mikroOrmConfig from 'src/mikro-orm.config';
import { TcgGame, TcgSet } from 'src/infra/database';
import { TcgSeries } from 'src/infra/database/tcg-series.entity';
import { TcgSetType } from 'src/infra/database/types';

export async function loadTcgDexSeries(
  em: EntityManager,
): Promise<TcgSeries[]> {
  // Instantiate the SDK
  const tcgdex = new TCGdex('en');

  const pokemonTcgGame = await em.findOne(TcgGame, { name: 'Pokemon' });
  if (!pokemonTcgGame) {
    throw new Error('Pokemon TCG Game not found, ensure DB was seeded');
  }

  const series = await tcgdex.fetch('series');
  if (series === undefined) {
    return [];
  }
  const tcgSeries: TcgSeries[] = [];
  for (const serie of series) {
    const mappedSeries = em.create(TcgSeries, {
      game: pokemonTcgGame,
      name: serie.name,
      logo: serie.logo ? `${serie.logo}.png` : undefined,
      code: serie.id,
      isHidden: false,
    });

    tcgSeries.push(mappedSeries);

    em.persist(mappedSeries);
  }

  await em.flush();

  return tcgSeries;
}

export async function loadTcgDexSetsForSeries(
  em: EntityManager,
  seriesName: string,
) {
  // Instantiate the SDK
  const tcgdex = new TCGdex('en');

  // Fetch the series to get/add sets to
  const tcgSeries = await em.findOne(TcgSeries, { name: seriesName });
  if (!tcgSeries) {
    throw new Error('TcgSeries not found, ensure they have been loaded first');
  }

  // Fetch the TcgGame these sets are for
  const pokemonTcgGame = await em.findOne(TcgGame, { name: 'Pokemon' });
  if (!pokemonTcgGame) {
    throw new Error('Pokemon TCG Game not found, ensure DB was seeded');
  }

  // Fetch the sets for the series from TCGDex
  const sets = await tcgdex.fetchSets(seriesName);
  if (sets === undefined) {
    return;
  }
  const tcgSets: TcgSet[] = [];
  for (const set of sets) {
    // Fetch the setDetails for each set
    const fetchedSet = await tcgdex.fetch('sets', set.id);
    if (!fetchedSet) {
      throw new Error(`Error fetching set ${set.id}`);
    }
    const mappedSet = em.create(TcgSet, {
      game: pokemonTcgGame,
      code: fetchedSet['abbreviation'].official,
      series: tcgSeries,
      name: set.name,
      releaseDate: fetchedSet.releaseDate,
      isUserVisible: true,
      logo: fetchedSet.logo ? `${fetchedSet.logo}.png` : undefined,
      type: TcgSetType.Main, // TODO: Refine this
    });

    tcgSets.push(mappedSet);

    em.persist(mappedSet);
  }

  await em.flush();

  return tcgSets;
}

async function main() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  const serieses = await loadTcgDexSeries(em);
  console.log(`Loaded ${serieses.length} series from tcgdex`);

  for (const series of serieses) {
    await loadTcgDexSetsForSeries(em, series.name);
  }

  await orm.close();
  console.log('Import completed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
