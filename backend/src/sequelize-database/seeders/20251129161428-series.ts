'use strict';

import {
  POKEMON_SERIES_TABLE_NAME,
  PokemonSeries,
} from '../../pokemon-series/entities/pokemon-series.entity';
import {
  POKEMON_SETS_TABLE_NAME,
  PokemonSet,
} from '../../pokemon-set/entities/pokemon-set.entity';
import { Migration } from 'sequelize-cli';
import { SerieList } from '@tcgdex/sdk';

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
  POKEMON_CARDS_TABLE_NAME,
  PokemonCard,
} from 'src/pokemon-card/entities/pokemon-card.entity';

export interface OutputSeriesData {
  name: string;
  logo?: string;
  rawTcgDexSeriesData: SerieList[number];
}

export interface RawSetData {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Record<string, string>;
  ptcgoCode: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
}

export interface RawTCGPlayerCardData {
  'TCGplayer Id': string;
  'Product Line': string;
  'Set Name': string;
  'Product Name': string;
  Title: string;
  Number: string;
  Rarity: string;
  Condition: string;
  'TCG Market Price': string;
  'TCG Direct Low': string;
  'TCG Low Price With Shipping': string;
  'TCG Low Price': string;
  'Total Quantity': string;
  'Add to Quantity': string;
  'TCG Marketplace Price': string;
  'Photo URL': string;
}

export type Printing =
  | 'normal'
  | 'holo'
  | 'reverse'
  | '1st edition holo'
  | '1st edition';

export enum Rarity {
  PROMO = 'Promo',
  COMMON = 'Common',
  RARE = 'Rare',
  HOLO_RARE = 'Holo Rare',
  UNCOMMON = 'Uncommon',
  SECRET_RARE = 'Secret Rare',
  ULTRA_RARE = 'Ultra Rare',
  SHINY_HOLO_RARE = 'Shiny Holo Rare',
  CODE_CARD = 'Code Card',
  UNCONFIRMED = 'Unconfirmed',
  RARE_ACE = 'Rare Ace',
  CLASSIC_COLLECTION = 'Classic Collection',
  RADIANT_RARE = 'Radiant Rare',
  PRISM_RARE = 'Prism Rare',
  DOUBLE_RARE = 'Double Rare',
  ILLUSTRATION_RARE = 'Illustration Rare',
  SPECIAL_ILLUSTRATION_RARE = 'Special Illustration Rare',
  MEGA_HYPER_RARE = 'Mega Hyper Rare',
  ACE_SPEC_RARE = 'ACE SPEC Rare',
  AMAZING_RARE = 'Amazing Rare',
  BLACK_WHITE_RARE = 'Black White Rare',
  SHINY_RARE = 'Shiny Rare',
  SHINY_ULTRA_RARE = 'Shiny Ultra Rare',
  HYPER_RARE = 'Hyper Rare',
  RARE_BREAK = 'Rare BREAK',
}

export interface CardData {
  rawTCGPlayerData: RawTCGPlayerCardData;
  set: RawSetData;
  printing: Printing;
  rarity: Rarity;
  number: string;
  name: string;
}

const readFile = <T>(filepath: string, shouldBeArray: boolean = true): T => {
  const rawSeriesFile = fs.readFileSync(path.join(process.cwd(), filepath));
  const data = JSON.parse(rawSeriesFile.toString());
  if (shouldBeArray && !Array.isArray(data)) {
    throw new Error('Data not an array');
  }

  return data;
};

async function* readNdJson<T = any>(filepath: string) {
  const fileStream = fs.createReadStream(path.join(process.cwd(), filepath), {
    encoding: 'utf-8',
  });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue; // skip empty lines
    yield JSON.parse(trimmed) as T;
  }
}

const migration: Migration = {
  async up(queryInterface, Sequelize) {
    const seriesData = readFile<OutputSeriesData[]>('./seed-data/series.json');
    const setData = readFile<RawSetData[]>('./seed-data/sets.json');
    const insertedSeriesData = (await queryInterface.bulkInsert(
      POKEMON_SERIES_TABLE_NAME,
      seriesData.map((s) => ({
        name: s.name,
        seriesId: s.rawTcgDexSeriesData.id,
        logo: s.logo,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {
        model: PokemonSeries,
        mapToModel: true,
        returning: true,
      } as any,
    )) as PokemonSeries[];

    console.log('insertedSeriesData.length', insertedSeriesData);

    const seriesPkByName = new Map<string, PokemonSeries>(
      insertedSeriesData.map((row) => [row.name, row]),
    );

    // console.log('seriesPkByName', seriesPkByName);

    const insertedSetData = (await queryInterface.bulkInsert(
      POKEMON_SETS_TABLE_NAME,
      setData
        .filter((s) => {
          const found = seriesPkByName.has(s.series);
          if (!found) {
            console.log('Error finding matching series', s);
            return false;
          }
          return found;
        })
        .map((s) => ({
          name: s.name,
          setId: s.id,
          printedTotal: s.printedTotal,
          total: s.total,
          ptcgoCode: s.ptcgoCode,
          releaseDate: s.releaseDate,
          symbolImage: s.images.symbol,
          seriesId: seriesPkByName.get(s.series)?.id,
          logoImage: s.images.logo,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      {
        model: PokemonSeries,
        mapToModel: true,
        returning: true,
      } as any,
    )) as PokemonSet[];

    console.log('insertedSetData', insertedSetData.length);

    const setPkByName = new Map<string, PokemonSet>(
      insertedSetData.map((set) => [set.name, set]),
    );

    // Do card insertion
    const cards: any[] = [];
    for await (const card of readNdJson<CardData>('./seed-data/cards.ndjson')) {
      const set = setPkByName.get(card.rawTCGPlayerData['Set Name']);
      if (set === undefined) {
        continue;
      }
      cards.push({
        printing: card.printing,
        rarity: card.rarity,
        number: card.number,
        name: card.name,
        setId: setPkByName.get(card.rawTCGPlayerData['Set Name'])?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        // map fields from `card` into your DB shape
      });

      // optionally batch insert to avoid huge arrays in memory
      if (cards.length >= 1000) {
        await queryInterface.bulkInsert(POKEMON_CARDS_TABLE_NAME, cards);
        cards.length = 0;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // await queryInterface.bulkDelete(POKEMON_SERIES_TABLE_NAME);
  },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = migration;
