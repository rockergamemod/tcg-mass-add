"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLeadingZeroes = removeLeadingZeroes;
exports.extractArtVariantFromRow = extractArtVariantFromRow;
exports.importTcgplayerCsvRows = importTcgplayerCsvRows;
exports.main = main;
const postgresql_1 = require("@mikro-orm/postgresql");
const tcgplayer_csv_parser_1 = require("./tcgplayer-csv-parser");
const types_1 = require("../../infra/database/types");
const database_1 = require("../../infra/database");
const mikro_orm_config_1 = __importDefault(require("../../mikro-orm.config"));
function debugPrint(...thingToPrint) {
    if (process.env['DEBUG_PRINT'] === '1') {
        console.log(...thingToPrint);
    }
}
const SET_CODE_MAP = {
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
    ['Near Mint', types_1.CardFinishType.Normal],
    ['Near Mint Reverse Holofoil', types_1.CardFinishType.ReverseHolo],
    ['Near Mint Holofoil', types_1.CardFinishType.Holo],
    ['Near Mint Unlimited', types_1.CardFinishType.Unlimited],
    ['Near Mint Unlimited Holofoil', types_1.CardFinishType.UnlimitedHolo],
    ['Near Mint 1st Edition', types_1.CardFinishType.FirstEdition],
    ['Near Mint 1st Edition Holofoil', types_1.CardFinishType.FirstEditionHolo],
]);
const finishToTcgplayerConditionMap = new Map([
    [types_1.CardFinishType.Normal, 'Near Mint'],
    [types_1.CardFinishType.ReverseHolo, 'Near Mint Reverse Holofoil'],
    [types_1.CardFinishType.Holo, 'Near Mint Holofoil'],
    [types_1.CardFinishType.Unlimited, 'Near Mint Unlimited'],
    [types_1.CardFinishType.UnlimitedHolo, 'Near Mint Unlimited Holofoil'],
    [types_1.CardFinishType.FirstEdition, 'Near Mint 1st Edition'],
    [types_1.CardFinishType.FirstEditionHolo, 'Near Mint 1st Edition Holofoil'],
]);
const setNameOverride = new Map([
    ['Black and White', 'Black & White'],
    ['Crown Zenith: Galarian Gallery', 'Crown Zenith'],
    ['Diamond and Pearl', 'Diamond & Pearl'],
    ['Diamond and Pearl Promos', 'DP Black Star Promos'],
    ['Expedition', 'Expedition Base Set'],
    ['Generations: Radiant Collection', 'Generations'],
    ['HGSS Promos', 'HGSS Black Star Promos'],
    ['Hidden Fates: Shiny Vault', 'Hidden Fates'],
    ['Jumbo Cards', 'Jumbo cards'],
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
    ['ME: Mega Evolution Promo', 'MEP Black Star Promos'],
    ['Nintendo Promos', 'Nintendo Black Star Promos'],
    ['Pokemon GO', 'Pokémon GO'],
    ['Ruby and Sapphire', 'Ruby & Sapphire'],
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
    ['SV: Black Bolt', 'Black Bolt'],
    ['SV: Paldean Fates', 'Paldean Fates'],
    ['SV: Prismatic Evolutions', 'Prismatic Evolutions'],
    ['SV: Scarlet & Violet 151', '151'],
    ['SV: Scarlet & Violet Promo Cards', 'SVP Black Star Promos'],
    ['SV: Shrouded Fable', 'Shrouded Fable'],
    ['SV: White Flare', 'White Flare'],
    ['SV01: Scarlet & Violet Base Set', 'Scarlet & Violet'],
    ['SWSH: Sword & Shield Promo Cards', 'SWSH Black Star Promos'],
    ['SWSH01: Sword & Shield Base Set', 'Sword & Shield'],
    ['SWSH09: Brilliant Stars Trainer Gallery', 'Brilliant Stars'],
    ['SWSH10: Astral Radiance Trainer Gallery', 'Astral Radiance'],
    ['SWSH11: Lost Origin Trainer Gallery', 'Lost Origin'],
    ['SWSH12: Silver Tempest Trainer Gallery', 'Silver Tempest'],
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
]);
function removeLeadingZeroes(numericString) {
    if (!numericString || numericString.length === 0) {
        return numericString;
    }
    const trimmed = numericString.replace(/^0+/, '');
    return trimmed === '' ? '0' : trimmed;
}
function extractArtVariantFromRow(row, cardFinish) {
    if (cardFinish === undefined) {
        return types_1.CardArtVariant.Normal;
    }
    if ([
        types_1.CardFinishType.FirstEdition,
        types_1.CardFinishType.Unlimited,
        types_1.CardFinishType.FirstEditionHolo,
        types_1.CardFinishType.UnlimitedHolo,
    ].includes(cardFinish)) {
        return types_1.CardArtVariant.Normal;
    }
    if (row.rarity === 'Illustration Rare') {
        return types_1.CardArtVariant.IllustrationRare;
    }
    if (row.rarity === 'Special Illustration Rare') {
        return types_1.CardArtVariant.SpecialIllustrationRare;
    }
    if (row.productName.endsWith('(Alternate Full Art)')) {
        return types_1.CardArtVariant.AltFullArt;
    }
    if (row.productName.endsWith('(Full Art)')) {
        return types_1.CardArtVariant.AltArt;
    }
    if (row.productName.endsWith('(Alternate Art Secret)')) {
        return types_1.CardArtVariant.AltArtSecret;
    }
    if (row.productName.endsWith('(Secret)')) {
        return types_1.CardArtVariant.Secret;
    }
    if (row.productName.endsWith('(Poke Ball Pattern)')) {
        return types_1.CardArtVariant.PokeBall;
    }
    if (row.productName.endsWith('(Master Ball Pattern)')) {
        return types_1.CardArtVariant.MasterBall;
    }
    return types_1.CardArtVariant.Normal;
}
async function findSetByTcgPlayerSetName(em, game, tcgPlayerSetName, cache) {
    let existingSet = cache.get(tcgPlayerSetName);
    if (existingSet !== undefined && existingSet !== null) {
        return existingSet;
    }
    else if (existingSet === null) {
        return existingSet;
    }
    let set = await em.findOne(database_1.TcgSet, {
        game,
        name: tcgPlayerSetName,
    });
    if (set) {
        cache.set(tcgPlayerSetName, set);
        return set;
    }
    const hasSetNameOverride = setNameOverride.get(tcgPlayerSetName);
    debugPrint('hasSetNameOverride', hasSetNameOverride);
    if (hasSetNameOverride) {
        set = await em.findOne(database_1.TcgSet, {
            game,
            name: hasSetNameOverride,
        });
        if (set) {
            cache.set(hasSetNameOverride, set);
            return set;
        }
    }
    const prefixPattern = /^[A-Z]+\d+:?\s*/;
    const nameWithoutPrefix = tcgPlayerSetName.replace(prefixPattern, '').trim();
    if (nameWithoutPrefix !== tcgPlayerSetName) {
        set = await em.findOne(database_1.TcgSet, {
            game,
            name: nameWithoutPrefix,
        });
        if (set) {
            cache.set(tcgPlayerSetName, set);
            return set;
        }
        const ilikeSets = await em.find(database_1.TcgSet, {
            game,
            name: { $ilike: `%${nameWithoutPrefix}%` },
        });
        if (ilikeSets.length === 1) {
            cache.set(tcgPlayerSetName, ilikeSets[0]);
            return ilikeSets[0];
        }
        else if (ilikeSets.length > 1) {
            console.log(`Ambiguous match for set using ILIKE: ${nameWithoutPrefix} returned ${ilikeSets.length} sets`, ilikeSets.map((s) => s.name));
        }
        else {
            console.log(`Unable to find matching set with ILIKE: ${nameWithoutPrefix} `);
        }
    }
    cache.set(tcgPlayerSetName, null);
    console.log(`Can't find set with name: "${tcgPlayerSetName}"`);
    return null;
}
async function importTcgplayerCsvRows(em, rows, opts = {}) {
    const gameKey = opts.gameKey ?? types_1.GameKey.Pokemon;
    const game = await em.findOneOrFail(database_1.TcgGame, { key: gameKey });
    const setCache = new Map();
    const allCards = await em.findAll(database_1.TcgCard, { populate: ['printings'] });
    console.log(`Fetched ${allCards.length} Cards`);
    const allSources = await em.findAll(database_1.TcgCardSource, {
        where: { source: types_1.CardSourceType.Tcgplayer },
    });
    console.log(`Fetched ${allSources.length} CardSources`);
    let counter = 0;
    for (const row of rows) {
        counter++;
        if (counter % 1000 === 0) {
            console.log(`On row ${counter}...`);
        }
        if (row.productLine !== 'Pokemon')
            continue;
        if (row.productName.startsWith('Code Card - '))
            continue;
        const tcgPlayerSetName = row.setName;
        const set = await findSetByTcgPlayerSetName(em, game, tcgPlayerSetName, setCache);
        if (!set || set === null) {
            continue;
        }
        debugPrint('set', JSON.stringify(set, null, 2));
        const cardNumber = row.number.split('/')[0];
        debugPrint('cardNumber', cardNumber);
        const noZeroesCardNumber = removeLeadingZeroes(cardNumber);
        debugPrint('noZeroesCardNumber', noZeroesCardNumber);
        let card = allCards.find((c) => {
            return (c.set.id === set.id &&
                [cardNumber, noZeroesCardNumber].includes(c.collectorNumber));
        });
        debugPrint(JSON.stringify(card, null, 2));
        if (!card) {
            console.log('Card not found, continuing...', row.productName, row.number, set.name);
            continue;
        }
        let source = allSources.find((s) => s.source === types_1.CardSourceType.Tcgplayer &&
            s.sourceCardId === row.tcgplayerProductId);
        debugPrint(JSON.stringify(source, null, 2));
        if (!source) {
            source = em.create(database_1.TcgCardSource, {
                card,
                source: types_1.CardSourceType.Tcgplayer,
                sourceCardId: row.tcgplayerProductId,
                sourceSetCode: SET_CODE_MAP[row.setName],
                sourceSetName: row.setName,
                sourceName: row.productName,
                rawExtra: { data: row },
                isPrimary: false,
            });
            em.persist(source);
        }
        else {
            source.sourceSetCode = SET_CODE_MAP[row.setName];
            em.persist(source);
        }
        const cardFinish = tcgplayerConditionToFinishMap.get(row.condition);
        debugPrint(cardFinish);
        if (cardFinish) {
            const artVariant = extractArtVariantFromRow(row, cardFinish);
            const existingCardPrinting = card.printings.find((p) => p.finishType !== undefined &&
                cardFinish !== undefined &&
                p.finishType === cardFinish &&
                p.artVariant === artVariant);
            if (!existingCardPrinting) {
                const printing = em.create(database_1.TcgCardPrinting, {
                    card,
                    artVariant,
                    finishType: cardFinish,
                    isDefault: false,
                    source,
                });
                card.printings.add(printing);
                em.persist(printing);
            }
            else {
                existingCardPrinting.artVariant = artVariant;
                existingCardPrinting.source = source;
                em.persist(existingCardPrinting);
            }
        }
        else {
            console.log(`Unable to parse card finish: "${row.condition}"`);
        }
        if (counter % 1000 === 0) {
            console.log('Flushing EM....');
            await em.flush();
        }
    }
    await em.flush();
}
async function main() {
    const filepath = process.argv[2];
    if (!filepath) {
        throw new Error(`filepath to TCGPlayer data missing missing`);
    }
    const orm = await postgresql_1.MikroORM.init(mikro_orm_config_1.default);
    const em = orm.em.fork();
    const rowData = await (0, tcgplayer_csv_parser_1.parseTcgplayerCsv)(filepath);
    await importTcgplayerCsvRows(em, rowData, { gameKey: types_1.GameKey.Pokemon });
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
//# sourceMappingURL=tcgplayer-importer.js.map