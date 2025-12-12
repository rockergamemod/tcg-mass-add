// scripts/import-tcgplayer-csv.ts
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import TCGdex from '@tcgdex/sdk';

import mikroOrmConfig from 'src/mikro-orm.config';
import {
  TcgCard,
  TcgCardSource,
  TcgGame,
  TcgSet,
  TcgSeries,
  CardSourceType,
  TcgSetType,
  TcgSetSource,
} from '@repo/shared-types';

export async function loadTcgDexSeries(
  em: EntityManager,
  tcgdex: TCGdex,
  options: { shouldSkipSeries: boolean },
): Promise<TcgSeries[]> {
  const pokemonTcgGame = await em.findOne(TcgGame, { name: 'Pokemon' });
  if (!pokemonTcgGame) {
    throw new Error('Pokemon TCG Game not found, ensure DB was seeded');
  }

  // If skipping the series, just return the existing ones, dont do any real work.
  if (options.shouldSkipSeries) {
    return em.findAll(TcgSeries);
  }

  const series = await tcgdex.fetch('series');
  if (series === undefined) {
    return [];
  }
  const tcgSeries: TcgSeries[] = [];
  for (const serie of series) {
    const existingSeries = await em.findOne(TcgSeries, {
      game: pokemonTcgGame,
      name: serie.name,
    });
    const detailedSeries = await tcgdex.fetchSerie(serie.id);

    if (existingSeries && detailedSeries) {
      existingSeries.releaseDate = (detailedSeries as any).releaseDate;
      em.persist(existingSeries);
      continue;
    }

    const mappedSeries = em.create(TcgSeries, {
      game: pokemonTcgGame,
      name: serie.name,
      logo: serie.logo ? `${serie.logo}.png` : undefined,
      code: serie.id,
      isHidden: false,
      releaseDate: (detailedSeries as any).releaseDate,
    });

    tcgSeries.push(mappedSeries);

    em.persist(mappedSeries);
  }

  await em.flush();

  return tcgSeries;
}

export async function loadTcgDexSetsForSeries(
  em: EntityManager,
  tcgdex: TCGdex,
  series: TcgSeries,
  options: { shouldSkipSets: boolean },
) {
  // Fetch the TcgGame these sets are for
  const pokemonTcgGame = await em.findOne(TcgGame, { name: 'Pokemon' });
  if (!pokemonTcgGame) {
    throw new Error('Pokemon TCG Game not found, ensure DB was seeded');
  }

  // If skipping sets, simply return them all instead of doing work.
  if (options.shouldSkipSets) {
    return em.findAll(TcgSet);
  }

  // Fetch the sets for the series from TCGDex
  const sets = await tcgdex.fetchSets(series.name);
  if (sets === undefined) {
    return [];
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
      code: fetchedSet['abbreviation']
        ? fetchedSet['abbreviation'].official
        : undefined,
      series: series,
      name: set.name,
      releaseDate: fetchedSet.releaseDate,
      isUserVisible: true,
      logo: fetchedSet.logo ? `${fetchedSet.logo}.png` : undefined,
      type: TcgSetType.Main, // TODO: Refine this
    });

    const mappedSourceSet = em.create(TcgSetSource, {
      set: mappedSet,
      source: CardSourceType.Tcgdex,
      sourceSetId: fetchedSet.id,
      sourceSetCode: mappedSet.code,
      sourceSetName: fetchedSet.name,
      rawExtra: { data: fetchedSet },
      isPrimary: true,
    });

    tcgSets.push(mappedSet);

    em.persist(mappedSet);
    em.persist(mappedSourceSet);
  }

  await em.flush();

  return tcgSets;
}

export async function loadTcgDexCardsForSet(
  em: EntityManager,
  tcgdex: TCGdex,
  set: TcgSet,
  options: { shouldSkipCards: boolean },
) {
  const source = await em.findOneOrFail(TcgSetSource, {
    source: CardSourceType.Tcgdex,
    sourceSetName: set.name,
  });
  const dexSet = await tcgdex.fetch('sets', source.sourceSetId);
  if (!dexSet) {
    throw new Error(`Unable to find cards for set ${set.name}`);
  }
  const dexCards = dexSet.cards;
  const result: TcgCard[] = [];

  const existingCardsForSet =
    (await em.find(TcgCard, { set: { name: source.sourceSetName } })) ?? [];

  // Just return the cards, dont do any work.
  if (options.shouldSkipCards) {
    return existingCardsForSet;
  }
  for (const dexCard of dexCards) {
    const dexCardFull = await tcgdex.fetch('cards', dexCard.id);
    const dexCardFull2 = await tcgdex.card.get(dexCard.id);
    if (!dexCardFull || !dexCardFull2) {
      continue;
    }

    let card = existingCardsForSet.find(
      (c) =>
        c.canonicalName === dexCardFull.name &&
        c.collectorNumber === dexCardFull.localId &&
        c.rarity === dexCardFull.rarity &&
        c.supertype === dexCardFull.category &&
        c.subtype === dexCardFull.stage,
    );

    // Ensure the card is up to date if found
    if (card) {
      card.image = dexCardFull2.getImageURL('low', 'png');
      card.imageHigh = dexCardFull2.getImageURL('high', 'png');
    } else {
      card = em.create(TcgCard, {
        set: set,
        collectorNumber: dexCardFull2.localId,
        canonicalName: dexCardFull2.name,
        rarity: dexCardFull2.rarity,
        supertype: dexCardFull2.category,
        subtype: dexCardFull2.stage,
        image: dexCardFull2.getImageURL('low', 'png'),
        imageHigh: dexCardFull2.getImageURL('high', 'png'),
      });
    }

    // const cardPricing = dexCardFull['pricing']['tcgplayer'];

    // const printings = cardPricing
    //   ? Object.keys(cardPricing)
    //       .filter((k): k is CardFinishType =>
    //         Object.values(CardFinishType).includes(k as any),
    //       )
    //       .map((finish) =>
    //         em.create(TcgCardPrinting, {
    //           card: mappedCard,
    //           finishType: finish,
    //           isDefault: false,
    //         }),
    //       )
    //   : [];

    const cardSource = em.create(TcgCardSource, {
      card: card,
      source: CardSourceType.Tcgdex,
      sourceCardId: dexCardFull.id,
      sourceSetCode: source.sourceSetCode,
      sourceSetName: source.sourceSetName,
      sourceName: dexCardFull.name,
      rawExtra: { data: dexCardFull },
      isPrimary: true,
    });

    result.push(card);
    em.persist(card);
    // em.persist(printings);
    em.persist(cardSource);
  }

  await em.flush();

  return result;
}

async function main() {
  const shouldSkipSeries = process.env['SHOULD_SKIP_SERIES'] === 'true';
  const shouldSkipSets = process.env['SHOULD_SKIP_SETS'] === 'true';
  const shouldSkipCards = process.env['SHOULD_SKIP_CARDS'] === 'true';
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();
  // Instantiate the SDK
  const tcgdex = new TCGdex('en');

  const serieses = await loadTcgDexSeries(em, tcgdex, { shouldSkipSeries });
  console.log(`Loaded ${serieses.length} series from tcgdex`);

  for (const series of serieses) {
    const sets = await loadTcgDexSetsForSeries(em, tcgdex, series, {
      shouldSkipSets,
    });
    console.log(`Loaded ${sets.length} sets.`);

    for (const set of sets) {
      const cards = await loadTcgDexCardsForSet(em, tcgdex, set, {
        shouldSkipCards,
      });
      console.log(`Loaded ${cards.length} cards.`);
    }
  }
  await orm.close();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => {
    console.log('Import completed');
  });
