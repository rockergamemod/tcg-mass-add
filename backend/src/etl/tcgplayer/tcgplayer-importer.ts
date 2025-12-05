import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { parseTcgplayerCsv, TcgplayerCsvRow } from './tcgplayer-csv-parser';
import { CardSourceType, GameKey } from 'src/infra/database/types';
import {
  TcgCard,
  TcgCardSource,
  TcgGame,
  TcgplayerProduct,
  TcgSet,
} from 'src/infra/database';
import mikroOrmConfig from 'src/mikro-orm.config';

interface ImportOptions {
  gameKey?: GameKey;
}

export function removeLeadingZeroes(numericString: string): string {
  if (!numericString || numericString.length === 0) {
    return numericString;
  }

  // Handle case where string is all zeros - return "0"
  const trimmed = numericString.replace(/^0+/, '');
  return trimmed === '' ? '0' : trimmed;
}

async function findSetByTcgPlayerSetName(
  em: EntityManager,
  game: TcgGame,
  tcgPlayerSetName: string,
  cache: Map<string, TcgSet | null>,
): Promise<TcgSet | null> {
  let existingSet = cache.get(tcgPlayerSetName);
  if (existingSet !== undefined && existingSet !== null) {
    return existingSet;
  } else if (existingSet === null) {
    console.log('Previous attempt to find this set failed, skipping...');
    return existingSet;
  }

  let set = await em.findOne(TcgSet, {
    game,
    name: tcgPlayerSetName,
  });

  if (set) {
    cache.set(tcgPlayerSetName, set);
    return set;
  }

  // Set name from TCGPlayer may not match exactly the set name (because TCGPlayer is weird like that.)
  // Fuzzy-find the set and cache it.

  // Strip common prefix patterns (e.g., "ME02: ", "SV3: ", etc.)
  // Pattern matches: "ABC123: ", "AB123: ", etc.
  const prefixPattern = /^[A-Z]+\d+:?\s*/;
  const nameWithoutPrefix = tcgPlayerSetName.replace(prefixPattern, '').trim();
  if (nameWithoutPrefix !== tcgPlayerSetName) {
    set = await em.findOne(TcgSet, {
      game,
      name: nameWithoutPrefix,
    });
    if (set) {
      cache.set(tcgPlayerSetName, set);
      return set;
    }

    const ilikeSets = await em.find(TcgSet, {
      game,
      name: { $ilike: `%${nameWithoutPrefix}%` },
    });

    if (ilikeSets.length === 1) {
      cache.set(tcgPlayerSetName, ilikeSets[0]);
      return ilikeSets[0];
    } else if (ilikeSets.length > 1) {
      console.log(
        `Ambiguous match for set using ILIKE: ${nameWithoutPrefix} returned ${ilikeSets.length} sets`,
        ilikeSets.map((s) => s.name),
      );
    } else {
      console.log(
        `Unable to find matching set with ILIKE: ${nameWithoutPrefix} `,
      );
    }
  }

  cache.set(tcgPlayerSetName, null);
  console.log(`Can't find set with name: "${tcgPlayerSetName}"`);
  return null;
}

export async function importTcgplayerCsvRows(
  em: EntityManager,
  rows: TcgplayerCsvRow[],
  opts: ImportOptions = {},
) {
  const gameKey = opts.gameKey ?? GameKey.Pokemon;

  const game = await em.findOneOrFail(TcgGame, { key: gameKey });

  const setCache: Map<string, TcgSet> = new Map();

  const allProducts = await em.findAll(TcgplayerProduct);
  console.log(`Fetched ${allProducts.length} TCGPlayer Products`);
  const allCards = await em.findAll(TcgCard);
  console.log(`Fetched ${allCards.length} Cards`);
  const allSources = await em.findAll(TcgCardSource, {
    where: { source: CardSourceType.Tcgplayer },
  });
  console.log(`Fetched ${allSources.length} CardSources`);

  let counter = 0;

  // Basic simple loop; you can optimize with batch lookups later
  for (const row of rows) {
    counter++;
    if (counter % 1000 === 0) {
      console.log(`On row ${counter}...`);
    }
    if (row.productLine !== 'Pokemon') continue; // filter if CSV has multiple lines

    const tcgPlayerSetName = row.setName;

    const set = await findSetByTcgPlayerSetName(
      em,
      game,
      tcgPlayerSetName,
      setCache,
    );
    if (!set || set === null) {
      continue;
    }

    const cardNumber = row.number.split('/')[0];

    // 2. Upsert card (set + number)
    let card = allCards.find((c) => {
      // const splitZeroesCardNumber = cardNumber.split('0');
      // const noZeroesCardNumber =
      //   splitZeroesCardNumber[splitZeroesCardNumber.length - 1];
      const noZeroesCardNumber = removeLeadingZeroes(cardNumber);
      return (
        c.collectorNumber === cardNumber ||
        c.collectorNumber === noZeroesCardNumber
      );
    });
    // let card = await em.findOne(TcgCard, {
    //   set,
    //   collectorNumber: cardNumber,
    // });

    // if (!card) {
    //   const splitZeroesCardNumber = cardNumber.split('0');
    //   const noZeroesCardNumber =
    //     splitZeroesCardNumber[splitZeroesCardNumber.length - 1];
    //   if (noZeroesCardNumber !== cardNumber) {
    //     card = await em.findOne(TcgCard, {
    //       set,
    //       collectorNumber: noZeroesCardNumber,
    //     });
    //   }
    // }
    if (!card) {
      console.log(
        'Card not found, continuing...',
        row.productName,
        row.number,
        set.name,
      );
      continue;
    }
    // 3. Upsert TcgCardSource for TCGplayer
    let source = allSources.find(
      (s) =>
        s.source === CardSourceType.Tcgplayer &&
        s.sourceCardId === row.tcgplayerProductId,
    );
    // let source = await em.findOne(TcgCardSource, {
    //   card: { id: card.id },
    //   source: CardSourceType.Tcgplayer,
    //   sourceCardId: row.tcgplayerProductId,
    // });

    if (!source) {
      source = em.create(TcgCardSource, {
        card,
        source: CardSourceType.Tcgplayer,
        sourceCardId: row.tcgplayerProductId,
        sourceSetCode: undefined,
        sourceSetName: row.setName,
        sourceName: row.productName,
        rawExtra: { data: row },
        isPrimary: false,
      });
      em.persist(source);
    } else {
      // keep mapping but update provider fields if changed
      // source.sourceSetName = row.setName;
      // source.sourceName = row.productName;
    }

    // 4. Upsert TcgplayerProduct
    // let product = await em.findOne(TcgplayerProduct, {
    //   tcgplayerProductId: Number(row.tcgplayerProductId),
    // });

    let product = allProducts.find(
      (p) => p.tcgplayerProductId === Number(row.tcgplayerProductId),
    );

    if (!product) {
      product = em.create(TcgplayerProduct, {
        tcgplayerProductId: Number(row.tcgplayerProductId),
        cardSource: source,
        productLine: row.productLine,
        productName: row.productName,
        setName: row.setName,
        collectorNumber: row.number,
        isActive: true,
        setCode: 'UNKNOWN',
        lastSeenAt: new Date(),
      });
      em.persist(product);
    } else {
      // product.cardSource = source;
      // product.productLine = row.productLine;
      // product.productName = row.productName;
      // product.setName = row.setName;
      // product.collectorNumber = row.number;
      // product.isActive = true;
      // product.lastSeenAt = new Date();
    }
  }

  await em.flush();
}

export async function main() {
  const filepath = process.argv[2];
  if (!filepath) {
    throw new Error(`filepath to TCGPlayer data missing missing`);
  }
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  const rowData = await parseTcgplayerCsv(filepath);
  await importTcgplayerCsvRows(em, rowData, { gameKey: GameKey.Pokemon });
}

main()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
