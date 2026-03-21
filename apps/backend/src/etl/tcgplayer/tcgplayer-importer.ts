import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { parseTcgplayerCsv, TcgplayerCsvRow } from './tcgplayer-csv-parser';

import {
  CardArtVariant,
  CardFinishType,
  CardSourceType,
  GameKey,
  TcgCard,
  TcgCardPrinting,
  TcgCardSource,
  TcgGame,
  TcgSet,
} from '@repo/shared-types';
import mikroOrmConfig from 'src/mikro-orm.config';

function debugPrint(...thingToPrint: any) {
  if (process.env['DEBUG_PRINT'] === '1') {
    console.log(...thingToPrint);
  }
}
interface ImportOptions {
  gameKey?: GameKey;
}

const SET_CODE_MAP: Record<string, string> = {
  'Alternate Art Promos': 'PR',
  Aquapolis: 'AQ',
  Arceus: 'AR',
  'Ash vs Team Rocket Deck Kit (JP Exclusive)': 'AVTR',
  'Base Set': 'BS',
  'Base Set (Shadowless)': 'BSS',
  'Base Set 2': 'BS2',
  'Battle Academy': 'BTA',
  'Battle Academy 2022': 'BA22',
  'Battle Academy 2024': 'BA24',
  'Best of Promos': 'PR',
  'Black and White': 'BLW',
  'Black and White Promos': 'PR',
  'Blister Exclusives': 'BLE',
  'Boundaries Crossed': 'BCR',
  'Burger King Promos': 'BKP',
  'BW Trainer Kit: Excadrill &amp; Zoroark': 'BLW',
  'Call of Legends': 'CL',
  Celebrations: 'CLB',
  'Celebrations: Classic Collection': 'CCC',
  "Champion's Path": 'CHP',
  'Countdown Calendar Promos': 'CCP',
  'Crown Zenith': 'CRZ',
  'Crown Zenith: Galarian Gallery': 'CRZ:GG',
  'Crystal Guardians': 'CG',
  'Dark Explorers': 'DEX',
  'Deck Exclusives': 'PR',
  'Delta Species': 'DS',
  Deoxys: 'DX',
  'Detective Pikachu': 'DEP',
  'Diamond and Pearl': 'DP',
  'Diamond and Pearl Promos': 'PR',
  'Double Crisis': 'DCR',
  'DP Trainer Kit: Manaphy &amp; Lucario': 'PR',
  'DP Training Kit 1 Blue': 'PR',
  'DP Training Kit 1 Gold': 'PR',
  Dragon: 'DR',
  'Dragon Frontiers': 'DF',
  'Dragon Majesty': 'DRM',
  'Dragon Vault': 'DRV',
  'Dragons Exalted': 'DRX',
  'e-Reader Sample Cards': 'SAMPLE',
  Emerald: 'EM',
  'Emerging Powers': 'EPO',
  'EX Battle Stadium': 'BST',
  'EX Trainer Kit 1: Latias &amp; Latios': 'PR',
  'EX Trainer Kit 2: Plusle &amp; Minun': 'PR',
  Expedition: 'EX',
  'FireRed &amp; LeafGreen': 'RG',
  'First Partner Pack': 'FPP',
  Fossil: 'FO',
  Generations: 'GEN',
  'Generations: Radiant Collection': 'GEN',
  'Great Encounters': 'GE',
  'Gym Challenge': 'G2',
  'Gym Heroes': 'G1',
  'HeartGold SoulSilver': 'HS',
  'HGSS Promos': 'PR',
  'HGSS Trainer Kit: Gyarados &amp; Raichu': 'PR',
  'Hidden Fates': 'HIF',
  'Hidden Fates: Shiny Vault': 'HIF:SV',
  'Hidden Legends': 'HL',
  'Holon Phantoms': 'HP',
  'Jumbo Cards': 'PR',
  Jungle: 'JU',
  'Kalos Starter Set': 'KSS',
  'Kids WB Promos': 'KWBP',
  'League &amp; Championship Cards': 'PR',
  'Legend Maker': 'LM',
  'Legendary Collection': 'LC',
  'Legendary Treasures': 'LTR',
  'Legendary Treasures: Radiant Collection': 'LTR',
  'Legends Awakened': 'LA',
  'Majestic Dawn': 'MD',
  "McDonald's 25th Anniversary Promos": 'MCD21',
  "McDonald's Promos 2014": 'MCD14',
  "McDonald's Promos 2015": 'MCD15',
  "McDonald's Promos 2016": 'MCD16',
  "McDonald's Promos 2017": 'MCD17',
  "McDonald's Promos 2018": 'MCD18',
  "McDonald's Promos 2019": 'MCD19',
  "McDonald's Promos 2022": 'MCD22',
  "McDonald's Promos 2023": 'M23',
  "McDonald's Promos 2024": 'M24',
  'ME: Ascended Heroes': 'ASC',
  'ME: Mega Evolution Promo': 'MEP',
  'ME01: Mega Evolution': 'MEG',
  'ME02: Phantasmal Flames': 'PFL',
  'MEE: Mega Evolution Energies': 'MEE',
  'Miscellaneous Cards &amp; Products': 'MCAP',
  'Mysterious Treasures': 'MT',
  'Neo Destiny': 'N4',
  'Neo Discovery': 'N2',
  'Neo Genesis': 'N1',
  'Neo Revelation': 'N3',
  'Next Destinies': 'NXD',
  'Nintendo Promos': 'PR',
  'Noble Victories': 'NVI',
  'Pikachu World Collection Promos': 'PWCP',
  'Plasma Blast': 'PLB',
  'Plasma Freeze': 'PLF',
  'Plasma Storm': 'PLS',
  Platinum: 'PL',
  'Pokemon GO': 'PGO',
  'POP Series 1': 'POP',
  'POP Series 2': 'POP',
  'POP Series 3': 'POP',
  'POP Series 4': 'POP',
  'POP Series 5': 'POP',
  'POP Series 6': 'POP',
  'POP Series 7': 'POP',
  'POP Series 8': 'POP',
  'POP Series 9': 'POP',
  'Power Keepers': 'PK',
  'Professor Program Promos': 'PPP',
  'Rising Rivals': 'RR',
  'Ruby and Sapphire': 'RS',
  Rumble: 'RUM',
  Sandstorm: 'SS',
  'Secret Wonders': 'SW',
  'Shining Fates': 'SHF',
  'Shining Fates: Shiny Vault': 'SHFSV',
  'Shining Legends': 'SHL',
  Skyridge: 'SK',
  'SM - Burning Shadows': 'SM03',
  'SM - Celestial Storm': 'CES',
  'SM - Cosmic Eclipse': 'SM12',
  'SM - Crimson Invasion': 'SM04',
  'SM - Forbidden Light': 'SM06',
  'SM - Guardians Rising': 'SM02',
  'SM - Lost Thunder': 'SM8',
  'SM - Team Up': 'SM9',
  'SM - Ultra Prism': 'SM05',
  'SM - Unbroken Bonds': 'SM10',
  'SM - Unified Minds': 'SM11',
  'SM Base Set': 'SM01',
  'SM Promos': 'SMP',
  'SM Trainer Kit: Alolan Sandslash &amp; Alolan Ninetales': 'SMK2',
  'SM Trainer Kit: Lycanroc &amp; Alolan Raichu': 'SMK1',
  'Southern Islands': 'SI',
  Stormfront: 'SF',
  'Supreme Victors': 'SV',
  'SV: Black Bolt': 'BLK',
  'SV: Paldean Fates': 'PAF',
  'SV: Prismatic Evolutions': 'PRE',
  'SV: Scarlet &amp; Violet 151': 'MEW',
  'SV: Scarlet &amp; Violet Promo Cards': 'SVP',
  'SV: Shrouded Fable': 'SFA',
  'SV: White Flare': 'WHT',
  'SV01: Scarlet &amp; Violet Base Set': 'SVI',
  'SV02: Paldea Evolved': 'PAL',
  'SV03: Obsidian Flames': 'OBF',
  'SV04: Paradox Rift': 'PAR',
  'SV05: Temporal Forces': 'TEF',
  'SV06: Twilight Masquerade': 'TWM',
  'SV07: Stellar Crown': 'SCR',
  'SV08: Surging Sparks': 'SSP',
  'SV09: Journey Together': 'JTG',
  'SV10: Destined Rivals': 'DRI',
  'SVE: Scarlet &amp; Violet Energies': 'SVE',
  'SWSH: Sword &amp; Shield Promo Cards': 'SWSD',
  'SWSH01: Sword &amp; Shield Base Set': 'SWSH01',
  'SWSH02: Rebel Clash': 'SWSH02',
  'SWSH03: Darkness Ablaze': 'SWSH03',
  'SWSH04: Vivid Voltage': 'SWSH04',
  'SWSH05: Battle Styles': 'SWSH05',
  'SWSH06: Chilling Reign': 'SWSH06',
  'SWSH07: Evolving Skies': 'SWSH07',
  'SWSH08: Fusion Strike': 'SWSH08',
  'SWSH09: Brilliant Stars': 'SWSH09',
  'SWSH09: Brilliant Stars Trainer Gallery': 'SWSH09:TG',
  'SWSH10: Astral Radiance': 'SWSH10',
  'SWSH10: Astral Radiance Trainer Gallery': 'SWSH10:TG',
  'SWSH11: Lost Origin': 'SWSH11',
  'SWSH11: Lost Origin Trainer Gallery': 'SWSH11: TG',
  'SWSH12: Silver Tempest': 'SWSH12',
  'SWSH12: Silver Tempest Trainer Gallery': 'SWSH12: TG',
  'Team Magma vs Team Aqua': 'MA',
  'Team Rocket': 'TR',
  'Team Rocket Returns': 'RR',
  'Trading Card Game Classic': 'CL',
  'Trick or Trade BOOster Bundle': 'TTBB',
  'Trick or Trade BOOster Bundle 2023': 'TTBB23',
  'Trick or Trade BOOster Bundle 2024': 'TTBB24',
  Triumphant: 'TM',
  Undaunted: 'UD',
  Unleashed: 'UL',
  'Unseen Forces': 'UF',
  'World Championship Decks': 'WCD',
  'WoTC Promo': 'PR',
  'XY - Ancient Origins': 'AOR',
  'XY - BREAKpoint': 'BKP',
  'XY - BREAKthrough': 'BKT',
  'XY - Evolutions': 'EVO',
  'XY - Fates Collide': 'FCO',
  'XY - Flashfire': 'FLF',
  'XY - Furious Fists': 'FFI',
  'XY - Phantom Forces': 'PHF',
  'XY - Primal Clash': 'PRC',
  'XY - Roaring Skies': 'ROS',
  'XY - Steam Siege': 'STS',
  'XY Base Set': 'XY',
  'XY Promos': 'PR',
  'XY Trainer Kit: Bisharp &amp; Wigglytuff': 'PR',
  'XY Trainer Kit: Latias &amp; Latios': 'PR',
  'XY Trainer Kit: Pikachu Libre &amp; Suicune': 'PR',
  'XY Trainer Kit: Sylveon &amp; Noivern': 'PR',
};

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
  ['ME: Ascended Heroes', 'Ascended Heroes'],
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

export function extractArtVariantFromRow(
  row: TcgplayerCsvRow,
  cardFinish: CardFinishType | undefined,
): CardArtVariant {
  if (cardFinish === undefined) {
    return CardArtVariant.Normal;
  }
  if (
    [
      CardFinishType.FirstEdition,
      CardFinishType.Unlimited,
      CardFinishType.FirstEditionHolo,
      CardFinishType.UnlimitedHolo,
    ].includes(cardFinish)
  ) {
    return CardArtVariant.Normal;
  }

  // Rarity-based variants
  if (row.rarity === 'Illustration Rare') {
    return CardArtVariant.IllustrationRare;
  }
  if (row.rarity === 'Special Illustration Rare') {
    return CardArtVariant.SpecialIllustrationRare;
  }

  // Name-based variants
  if (row.productName.endsWith('(Alternate Full Art)')) {
    return CardArtVariant.AltFullArt;
  }
  if (row.productName.endsWith('(Full Art)')) {
    return CardArtVariant.AltArt;
  }
  if (row.productName.endsWith('(Alternate Art Secret)')) {
    return CardArtVariant.AltArtSecret;
  }
  if (row.productName.endsWith('(Secret)')) {
    return CardArtVariant.Secret;
  }

  if (row.productName.endsWith('(Poke Ball Pattern)')) {
    return CardArtVariant.PokeBall;
  }
  if (row.productName.endsWith('(Master Ball Pattern)')) {
    return CardArtVariant.MasterBall;
  }

  return CardArtVariant.Normal;
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

    // TODO: Remove this.
    // if (row.productName !== 'Sewaddle') continue;
    // if (row.setName !== 'SV: White Flare') continue;

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
        sourceSetCode: SET_CODE_MAP[row.setName],
        sourceSetName: row.setName,
        sourceName: row.productName,
        rawExtra: { data: row },
        isPrimary: false,
      });
      em.persist(source);
    } else {
      source.sourceSetCode = SET_CODE_MAP[row.setName];
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

      // TODO: Art Variant needs to be populated for pokeball vs masterball, etc.

      const artVariant = extractArtVariantFromRow(row, cardFinish);

      const existingCardPrinting = card.printings.find(
        (p) =>
          p.finishType !== undefined &&
          cardFinish !== undefined &&
          p.finishType === cardFinish &&
          p.artVariant === artVariant,
      );
      if (!existingCardPrinting) {
        const printing = em.create(TcgCardPrinting, {
          card,
          artVariant,
          finishType: cardFinish,
          isDefault: false,
          source,
        });
        card.printings.add(printing);
        em.persist(printing);
      } else {
        existingCardPrinting.artVariant = artVariant;
        existingCardPrinting.source = source;
        em.persist(existingCardPrinting);
        // Printing might be a Pokeball / Masterball pattern. Check for that and attempt to create it.
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
