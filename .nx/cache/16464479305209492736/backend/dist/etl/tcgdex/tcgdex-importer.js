"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTcgDexSeries = loadTcgDexSeries;
exports.loadTcgDexSetsForSeries = loadTcgDexSetsForSeries;
exports.loadTcgDexCardsForSet = loadTcgDexCardsForSet;
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const sdk_1 = __importDefault(require("@tcgdex/sdk"));
const mikro_orm_config_1 = __importDefault(require("../../mikro-orm.config"));
const database_1 = require("../../infra/database");
const tcg_series_entity_1 = require("../../infra/database/tcg-series.entity");
const types_1 = require("../../infra/database/types");
const tcg_set_source_entity_1 = require("../../infra/database/tcg-set-source.entity");
async function loadTcgDexSeries(em, tcgdex, options) {
    const pokemonTcgGame = await em.findOne(database_1.TcgGame, { name: 'Pokemon' });
    if (!pokemonTcgGame) {
        throw new Error('Pokemon TCG Game not found, ensure DB was seeded');
    }
    if (options.shouldSkipSeries) {
        return em.findAll(tcg_series_entity_1.TcgSeries);
    }
    const series = await tcgdex.fetch('series');
    if (series === undefined) {
        return [];
    }
    const tcgSeries = [];
    for (const serie of series) {
        const existingSeries = await em.findOne(tcg_series_entity_1.TcgSeries, {
            game: pokemonTcgGame,
            name: serie.name,
        });
        const detailedSeries = await tcgdex.fetchSerie(serie.id);
        if (existingSeries && detailedSeries) {
            existingSeries.releaseDate = detailedSeries.releaseDate;
            em.persist(existingSeries);
            continue;
        }
        const mappedSeries = em.create(tcg_series_entity_1.TcgSeries, {
            game: pokemonTcgGame,
            name: serie.name,
            logo: serie.logo ? `${serie.logo}.png` : undefined,
            code: serie.id,
            isHidden: false,
            releaseDate: detailedSeries.releaseDate,
        });
        tcgSeries.push(mappedSeries);
        em.persist(mappedSeries);
    }
    await em.flush();
    return tcgSeries;
}
async function loadTcgDexSetsForSeries(em, tcgdex, series, options) {
    const pokemonTcgGame = await em.findOne(database_1.TcgGame, { name: 'Pokemon' });
    if (!pokemonTcgGame) {
        throw new Error('Pokemon TCG Game not found, ensure DB was seeded');
    }
    if (options.shouldSkipSets) {
        return em.findAll(database_1.TcgSet);
    }
    const sets = await tcgdex.fetchSets(series.name);
    if (sets === undefined) {
        return [];
    }
    const tcgSets = [];
    for (const set of sets) {
        const fetchedSet = await tcgdex.fetch('sets', set.id);
        if (!fetchedSet) {
            throw new Error(`Error fetching set ${set.id}`);
        }
        const mappedSet = em.create(database_1.TcgSet, {
            game: pokemonTcgGame,
            code: fetchedSet['abbreviation']
                ? fetchedSet['abbreviation'].official
                : undefined,
            series: series,
            name: set.name,
            releaseDate: fetchedSet.releaseDate,
            isUserVisible: true,
            logo: fetchedSet.logo ? `${fetchedSet.logo}.png` : undefined,
            type: types_1.TcgSetType.Main,
        });
        const mappedSourceSet = em.create(tcg_set_source_entity_1.TcgSetSource, {
            set: mappedSet,
            source: types_1.CardSourceType.Tcgdex,
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
async function loadTcgDexCardsForSet(em, tcgdex, set, options) {
    const source = await em.findOneOrFail(tcg_set_source_entity_1.TcgSetSource, {
        source: types_1.CardSourceType.Tcgdex,
        sourceSetName: set.name,
    });
    const dexSet = await tcgdex.fetch('sets', source.sourceSetId);
    if (!dexSet) {
        throw new Error(`Unable to find cards for set ${set.name}`);
    }
    const dexCards = dexSet.cards;
    const result = [];
    const existingCardsForSet = (await em.find(database_1.TcgCard, { set: { name: source.sourceSetName } })) ?? [];
    if (options.shouldSkipCards) {
        return existingCardsForSet;
    }
    for (const dexCard of dexCards) {
        const dexCardFull = await tcgdex.fetch('cards', dexCard.id);
        const dexCardFull2 = await tcgdex.card.get(dexCard.id);
        if (!dexCardFull || !dexCardFull2) {
            continue;
        }
        let card = existingCardsForSet.find((c) => c.canonicalName === dexCardFull.name &&
            c.collectorNumber === dexCardFull.localId &&
            c.rarity === dexCardFull.rarity &&
            c.supertype === dexCardFull.category &&
            c.subtype === dexCardFull.stage);
        if (card) {
            card.image = dexCardFull2.getImageURL('low', 'png');
            card.imageHigh = dexCardFull2.getImageURL('high', 'png');
        }
        else {
            card = em.create(database_1.TcgCard, {
                set: set,
                collectorNumber: dexCardFull2.localId,
                canonicalName: dexCardFull2.name,
                rarity: dexCardFull2.rarity,
                supertype: dexCardFull2.category,
                subtype: dexCardFull2.stage,
                printings: [],
                image: dexCardFull2.getImageURL('low', 'png'),
                imageHigh: dexCardFull2.getImageURL('high', 'png'),
            });
        }
        const cardSource = em.create(database_1.TcgCardSource, {
            card: card,
            source: types_1.CardSourceType.Tcgdex,
            sourceCardId: dexCardFull.id,
            sourceSetCode: source.sourceSetCode,
            sourceSetName: source.sourceSetName,
            sourceName: dexCardFull.name,
            rawExtra: { data: dexCardFull },
            isPrimary: true,
        });
        result.push(card);
        em.persist(card);
        em.persist(cardSource);
    }
    await em.flush();
    return result;
}
async function main() {
    const shouldSkipSeries = process.env['SHOULD_SKIP_SERIES'] === 'true';
    const shouldSkipSets = process.env['SHOULD_SKIP_SETS'] === 'true';
    const shouldSkipCards = process.env['SHOULD_SKIP_CARDS'] === 'true';
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const em = orm.em.fork();
    const tcgdex = new sdk_1.default('en');
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
//# sourceMappingURL=tcgdex-importer.js.map