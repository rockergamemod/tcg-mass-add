import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { parseTcgplayerCsv, TcgplayerCsvRow } from './tcgplayer-csv-parser';
import {
  CardFinishType,
  CardSourceType,
  GameKey,
} from 'src/infra/database/types';
import {
  TcgCard,
  TcgCardPrinting,
  TcgCardSource,
  TcgGame,
  TcgplayerProduct,
  TcgSet,
} from 'src/infra/database';
import mikroOrmConfig from 'src/mikro-orm.config';

function debugPrint(...thingToPrint: any) {
  if (process.env['DEBUG_PRINT'] === '1') {
    console.log(...thingToPrint);
  }
}
interface ImportOptions {
  gameKey?: GameKey;
}

const tcgplayerConditionToFinishMap = new Map([
  ['Near Mint', CardFinishType.Normal],
  ['Near Mint Reverse Holofoil', CardFinishType.ReverseHolo],
  ['Near Mint Holofoil', CardFinishType.Holo],
  ['Near Mint Unlimited', CardFinishType.Unlimited],
  ['Near Mint Unlimited Holofoil', CardFinishType.UnlimitedHolo],
  ['Near Mint 1st Edition', CardFinishType.FirstEdition],
  ['Near Mint 1st Edition Holofoil', CardFinishType.FirstEditionHolo],
]);

const finishToTcgplayerConditionMap = new Map([
  [CardFinishType.Normal, 'Near Mint'],
  [CardFinishType.ReverseHolo, 'Near Mint Reverse Holofoil'],
  [CardFinishType.Holo, 'Near Mint Holofoil'],
  [CardFinishType.Unlimited, 'Near Mint Unlimited'],
  [CardFinishType.UnlimitedHolo, 'Near Mint Unlimited Holofoil'],
  [CardFinishType.FirstEdition, 'Near Mint 1st Edition'],
  [CardFinishType.FirstEditionHolo, 'Near Mint 1st Edition Holofoil'],
]);

const setNameOverride: Map<string, string> = new Map([
  // ['SV: Scarlet & Violet 151', '151'],
  // ['Alternate Art Promos', ''],
  // ['Ash vs Team Rocket Deck Kit (JP Exclusive)', ''],
  // ['Base Set (Shadowless)', ''], // TODO: Figure out whether we want to count shadowless inside base set, for now, yes?
  // ['Battle Academy', ''],
  // ['Battle Academy 2022', ''],
  // ['Battle Academy 2024', ''],
  // ['Best of Promos', ''],
  ['Black and White', 'Black & White'],
  // ['Black and White Promos', ''],
  // ['Blister Exclusives', ''],
  // ['Burger King Promos', ''],
  // ['BW Trainer Kit: Excadrill & Zoroark', ''],
  // ['Celebrations: Classic Collection', ''],
  // ['Countdown Calendar Promos', ''],
  ['Crown Zenith: Galarian Gallery', 'Crown Zenith'],
  // ['Deck Exclusives', ''],
  ['Diamond and Pearl', 'Diamond & Pearl'],
  ['Diamond and Pearl Promos', 'DP Black Star Promos'],
  // ['DP Trainer Kit: Manaphy & Lucario', ''],
  // ['e-Reader Sample Cards', ''],
  // ['EX Battle Stadium', ''],
  // ['EX Trainer Kit 1: Latias & Latios', ''],
  // ['EX Trainer Kit 2: Plusle & Minun', ''],
  ['Expedition', 'Expedition Base Set'],
  // ['First Partner Pack', ''],
  ['Generations: Radiant Collection', 'Generations'],
  ['HGSS Promos', 'HGSS Black Star Promos'],
  // ['HGSS Trainer Kit: Gyarados & Raichu', ''],
  ['Hidden Fates: Shiny Vault', 'Hidden Fates'],
  ['Jumbo Cards', 'Jumbo cards'],
  // ['Kids WB Promos', ''],
  // ['League & Championship Cards', ''],
  ['Legendary Treasures: Radiant Collection', 'Legendary Treasures'],
  ["McDonald's 25th Anniversary Promos", "Macdonald's Collection 2021"],
  ["McDonald's Promos 2011", "Macdonald's Collection 2011"],
  ["McDonald's Promos 2012", "Macdonald's Collection 2012"],
  ["McDonald's Promos 2014", "Macdonald's Collection 2014"],
  ["McDonald's Promos 2015", "Macdonald's Collection 2015"],
  ["McDonald's Promos 2016", "Macdonald's Collection 2016"],
  ["McDonald's Promos 2017", "Macdonald's Collection 2017"],
  ["McDonald's Promos 2018", "Macdonald's Collection 2018"],
  ["McDonald's Promos 2019", "Macdonald's Collection 2019"],
  // ["McDonald's Promos 2022", "Macdonald's Collection 2011"],
  // ["McDonald's Promos 2023", "Macdonald's Collection 2011"],
  // ["McDonald's Promos 2024", "Macdonald's Collection 2011"],
  ['ME: Mega Evolution Promo', 'MEP Black Star Promos'],
  // ['MEE: Mega Evolution Energies', ''],
  // ['Miscellaneous Cards & Products', ''],
  // ['My First Battle', ''],
  ['Nintendo Promos', 'Nintendo Black Star Promos'],
  // ['Pikachu World Collection Promos', ''],
  // ['Player Placement Trainer Promos', ''],
  ['Pokemon GO', 'Pokémon GO'],
  // ['Prize Pack Series Cards', ''],
  // ['Professor Program Promos', ''],
  ['Ruby and Sapphire', 'Ruby & Sapphire'],
  // ['Rumble', ''],
  ['Shining Fates: Shiny Vault', 'Shining Fates'],
  ['SM - Burning Shadows', 'Burning Shadows'],
  ['SM - Celestial Storm', 'Celestial Storm'],
  ['SM - Cosmic Eclipse', 'Cosmic Eclipse'],
  ['SM - Crimson Invasion', 'Crimson Invasion'],
  ['SM - Forbidden Light', 'Forbidden Light'],
  ['SM - Guardians Rising', 'Guardians Rising'],
  ['SM - Lost Thunder', 'Lost Thunder'],
  ['SM - Team Up', 'Team Up'],
  ['SM - Ultra Prism', 'Ultra Prism'],
  ['SM - Unbroken Bonds', 'Unbroken Bonds'],
  ['SM - Unified Minds', 'Unified Minds'],
  ['SM Base Set', 'Sun & Moon'],
  ['SM Promos', 'SM Black Star Promos'],
  // ['SM Trainer Kit: Alolan Sandslash & Alolan Ninetales', ''],
  // ['SM Trainer Kit: Lycanroc & Alolan Raichu', ''],
  ['SV: Black Bolt', 'Black Bolt'],
  ['SV: Paldean Fates', 'Paldean Fates'],
  ['SV: Prismatic Evolutions', 'Prismatic Evolutions'],
  ['SV: Scarlet & Violet 151', '151'],
  ['SV: Scarlet & Violet Promo Cards', 'SVP Black Star Promos'],
  ['SV: Shrouded Fable', 'Shrouded Fable'],
  ['SV: White Flare', 'White Flare'],
  ['SV01: Scarlet & Violet Base Set', 'Scarlet & Violet'],
  // ['SVE: Scarlet & Violet Energies', ''],
  ['SWSH: Sword & Shield Promo Cards', 'SWSH Black Star Promos'],
  ['SWSH01: Sword & Shield Base Set', 'Sword & Shield'],
  ['SWSH09: Brilliant Stars Trainer Gallery', 'Brilliant Stars'],
  ['SWSH10: Astral Radiance Trainer Gallery', 'Astral Radiance'],
  ['SWSH11: Lost Origin Trainer Gallery', 'Lost Origin'],
  ['SWSH12: Silver Tempest Trainer Gallery', 'Silver Tempest'],
  // ['Trading Card Game Classic', ''],
  // ['Trick or Trade BOOster Bundle', ''],
  // ['Trick or Trade BOOster Bundle 2023', ''],
  // ['Trick or Trade BOOster Bundle 2024', ''],
  // ['World Championship Decks', ''],
  ['WoTC Promo', 'Wizards Black Star Promos'],
  ['XY - Ancient Origins', 'Ancient Origins'],
  ['XY - BREAKpoint', 'BREAKpoint'],
  ['XY - BREAKthrough', 'BREAKthrough'],
  ['XY - Evolutions', 'Evolutions'],
  ['XY - Fates Collide', 'Fates Collide'],
  ['XY - Flashfire', 'Flashfire'],
  ['XY - Furious Fists', 'Furious Fists'],
  ['XY - Phantom Forces', 'Phantom Forces'],
  ['XY - Primal Clash', 'Primal Clash'],
  ['XY - Roaring Skies', 'Roaring Skies'],
  ['XY - Steam Siege', 'Steam Siege'],
  ['XY Base Set', 'XY'],
  ['XY Promos', 'XY Black Star Promos'],
  // ['XY Trainer Kit: Bisharp & Wigglytuff', ''],
  // ['XY Trainer Kit: Latias & Latios', ''],
  // ['XY Trainer Kit: Pikachu Libre & Suicune', ''],
  // ['XY Trainer Kit: Sylveon & Noivern', ''],
]);

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
    // console.log('Previous attempt to find this set failed, skipping...');
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

  // Finally, attempt with a set-name override
  const hasSetNameOverride = setNameOverride.get(tcgPlayerSetName!);
  debugPrint('hasSetNameOverride', hasSetNameOverride);
  if (hasSetNameOverride) {
    set = await em.findOne(TcgSet, {
      game,
      name: hasSetNameOverride,
    });

    if (set) {
      cache.set(hasSetNameOverride, set);
      return set;
    }
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
  const allCards = await em.findAll(TcgCard, { populate: ['printings'] });
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
    if (row.productLine !== 'Pokemon') continue;
    if (row.productName.startsWith('Code Card - ')) continue;

    // REMOVE THIS
    // if (row.productName !== 'Nidoking - 034/165') continue;

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

    debugPrint('set', JSON.stringify(set, null, 2));

    const cardNumber = row.number.split('/')[0];
    debugPrint('cardNumber', cardNumber);
    const noZeroesCardNumber = removeLeadingZeroes(cardNumber);
    debugPrint('noZeroesCardNumber', noZeroesCardNumber);

    // 2. Upsert card (set + number)
    let card = allCards.find((c) => {
      return (
        c.set.id === set.id &&
        [cardNumber, noZeroesCardNumber].includes(c.collectorNumber)
      );
    });

    debugPrint(JSON.stringify(card, null, 2));

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
    debugPrint(JSON.stringify(source, null, 2));

    // Create the CardSource if it doesn't exist
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
    }

    const cardFinish = tcgplayerConditionToFinishMap.get(row.condition);
    debugPrint(cardFinish);
    if (cardFinish) {
      // const printing = em.create(TcgCardPrinting, {
      //   card,
      //   finishType: cardFinish,
      //   isDefault: false,
      // });
      // debugPrint(JSON.stringify(printing, null, 2));
      // card.printings.add(printing);
      // em.persist(printing);

      const existingCardPrinting = card.printings.find(
        (p) =>
          p.finishType !== undefined &&
          cardFinish !== undefined &&
          p.finishType === cardFinish,
      );
      if (!existingCardPrinting) {
        const printing = em.create(TcgCardPrinting, {
          card,
          finishType: cardFinish,
          isDefault: false,
        });
        card.printings.add(printing);
        em.persist(printing);
      } else {
        // console.log(
        //   'existingCardPrinting found' +
        //     existingCardPrinting.card.canonicalName,
        //   existingCardPrinting.finishType,
        // );
        // console.log(card.printings.map((p) => p.finishType));
      }
    } else {
      console.log(`Unable to parse card finish: "${row.condition}"`);
    }

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
    }

    if (counter % 1000 === 0) {
      console.log('Flushing EM....');
      await em.flush();
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
