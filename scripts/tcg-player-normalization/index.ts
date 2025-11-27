import fs from "fs";
import path from "path";
import csv from "csv-parser";
import ndjson from "ndjson";
import TCGdex, { SerieList } from "@tcgdex/sdk";

// Instantiate the SDK
const tcgdex = new TCGdex("en");

export interface RawTCGPlayerCardData {
  "TCGplayer Id": string;
  "Product Line": string;
  "Set Name": string;
  "Product Name": string;
  Title: string;
  Number: string;
  Rarity: string;
  Condition: string;
  "TCG Market Price": string;
  "TCG Direct Low": string;
  "TCG Low Price With Shipping": string;
  "TCG Low Price": string;
  "Total Quantity": string;
  "Add to Quantity": string;
  "TCG Marketplace Price": string;
  "Photo URL": string;
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

export interface OutputSeriesData {
  name: string;
  logo?: string;
  rawTcgDexSeriesData: SerieList[number];
}

export type Printing =
  | "normal"
  | "holo"
  | "reverse"
  | "1st edition holo"
  | "1st edition";

export enum Rarity {
  PROMO = "Promo",
  COMMON = "Common",
  RARE = "Rare",
  HOLO_RARE = "Holo Rare",
  UNCOMMON = "Uncommon",
  SECRET_RARE = "Secret Rare",
  ULTRA_RARE = "Ultra Rare",
  SHINY_HOLO_RARE = "Shiny Holo Rare",
  CODE_CARD = "Code Card",
  UNCONFIRMED = "Unconfirmed",
  RARE_ACE = "Rare Ace",
  CLASSIC_COLLECTION = "Classic Collection",
  RADIANT_RARE = "Radiant Rare",
  PRISM_RARE = "Prism Rare",
  DOUBLE_RARE = "Double Rare",
  ILLUSTRATION_RARE = "Illustration Rare",
  SPECIAL_ILLUSTRATION_RARE = "Special Illustration Rare",
  MEGA_HYPER_RARE = "Mega Hyper Rare",
  ACE_SPEC_RARE = "ACE SPEC Rare",
  AMAZING_RARE = "Amazing Rare",
  BLACK_WHITE_RARE = "Black White Rare",
  SHINY_RARE = "Shiny Rare",
  SHINY_ULTRA_RARE = "Shiny Ultra Rare",
  HYPER_RARE = "Hyper Rare",
  RARE_BREAK = "Rare BREAK",
}
export interface CardData {
  rawTCGPlayerData: RawTCGPlayerCardData;
  set: RawSetData;
  printing: Printing;
  rarity: Rarity;
  number: string;
  name: string;
}

const readCsvFile = <T>(filepath: string): Promise<T[]> => {
  return new Promise((resolve) => {
    const results: T[] = [];
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
};

const readJsonFile = <T>(filepath: string): Promise<T[]> => {
  return new Promise((resolve) => {
    const data = JSON.parse(fs.readFileSync(filepath).toString());
    resolve(data);
  });
};

const uniqueBy = <T extends Record<string, any>>(
  rawTCGData: T[],
  key: keyof T
): string[] => {
  return rawTCGData.reduce<string[]>((acc, d) => {
    const value = d[key];
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
};

const extractSetNames = (rawTCGData: RawTCGPlayerCardData[]): string[] => {
  return rawTCGData.reduce<string[]>((acc, d) => {
    const setName = d["Set Name"];
    if (!acc.includes(setName)) {
      acc.push(setName);
    }
    return acc;
  }, []);
};

// const partitionBySet = (
//   rawTCGData: RawTCGPlayerCardData[]
// ): Record<string, RawTCGPlayerCardData[]> => {
//   return rawTCGData.reduce<Record<string, RawTCGPlayerCardData[]>>(
//     (acc, card) => {
//       const setName = card["Set Name"];
//       const matchingSet = setData.find((s) => s.name === setName);
//       if (!matchingSet) {
//         throw new Error("Unable to match set to code");
//       }

//       if (acc[setName]) {
//         acc[setName].push(card);
//       } else {
//         acc[setName] = [card];
//       }
//       return acc;
//     },
//     {}
//   );
// };

const writeSeriesData = (
  outputFolder: string,
  seriesList: OutputSeriesData[]
): void => {
  const outputFile = path.join(outputFolder, "series.json");
  fs.writeFileSync(outputFile, JSON.stringify(seriesList, null, 2));
};

const writeSetData = (outputFolder: string, setData: RawSetData[]): void => {
  const outputFile = path.join(outputFolder, "sets.json");
  fs.writeFileSync(outputFile, JSON.stringify(setData, null, 2));
};

const writeCardData = (outputFolder: string, cardData: CardData[]): void => {
  let buffer = "";

  cardData.map((c) => (buffer += JSON.stringify(c) + "\n"));

  const outputFile = path.join(outputFolder, "cards.ndjson");
  fs.writeFileSync(outputFile, buffer);
};

const conditionToPrintingMap: Record<string, Printing> = {
  "": "normal",
  Holofoil: "holo",
  "Reverse Holofoil": "reverse",
  "1st Edition Holofoil": "1st edition holo",
  "1st Edition": "1st edition",
  Unlimited: "normal",
  "Unlimited Holofoil": "holo",
};

/**
 * 'Near Mint Holofoil',
  'Near Mint',
  'Near Mint Reverse Holofoil',
  'Near Mint 1st Edition Holofoil',
  'Near Mint 1st Edition',
  'Near Mint Unlimited',
  'Near Mint Unlimited Holofoil'
 */
const extractPrintingFromCondition = (condition: string): Printing => {
  const rawCondition = condition.replace("Near Mint", "").trimStart();
  const printing = conditionToPrintingMap[rawCondition];

  if (!printing) {
    throw new Error(
      `Printing was not found, please check conditionToPrintingMap: "${rawCondition}"`
    );
  }

  return printing;
};

/**
 * This should maintain a string, as the leading 0's are important potentially later.
 * @param number '004/017', etc.
 */
const extractNumber = (rawCard: RawTCGPlayerCardData): string => {
  const extractedNumberStr = rawCard.Number.split("/")[0];
  if (!extractedNumberStr || extractedNumberStr.length === 0) {
    throw new Error(
      `Number extraction failed, unexpected result: "${extractedNumberStr}" -- "${rawCard["TCGplayer Id"]}"`
    );
  }

  return extractedNumberStr;
};

const isRarity = (str: string): str is Rarity => {
  if (
    typeof str !== "string" ||
    !Object.values(Rarity).includes(str as Rarity)
  ) {
    return false;
  }
  return true;
};

const extractRarity = (rawRarity: string): Rarity => {
  if (!isRarity(rawRarity)) {
    throw new Error(`Rarity is invalid: "${rawRarity}"`);
  }
  return rawRarity;
};

const findSetForCard = (
  card: RawTCGPlayerCardData,
  sets: RawSetData[]
): RawSetData | undefined => {
  const maybeSet = sets.find((s) => {
    if (s.name === undefined) {
      console.log("set not found??", s);
    }
    return card["Set Name"].toLowerCase().includes(s.name.toLowerCase());
  });

  if (maybeSet) {
    return maybeSet;
  }

  console.error(`Unable to find set for card: "${card["Set Name"]}"`);
  return undefined;
};

/**
 * {
  'TCGplayer Id': '2867629',
  'Product Line': 'Pokemon',
  'Set Name': 'POP Series 4',
  'Product Name': 'Mew',
  Title: '',
  Number: '004/017',
  Rarity: 'Rare',
  Condition: 'Near Mint Holofoil',
  'TCG Market Price': '54.27',
  'TCG Direct Low': '',
  'TCG Low Price With Shipping': '120.2400',
  'TCG Low Price': '120.2400',
  'Total Quantity': '',
  'Add to Quantity': '0',
  'TCG Marketplace Price': '',
  'Photo URL': ''
}
 */
const processCard = (
  rawCard: RawTCGPlayerCardData,
  set: RawSetData
): CardData => {
  return {
    rawTCGPlayerData: rawCard,
    set: set,
    printing: extractPrintingFromCondition(rawCard.Condition),
    rarity: extractRarity(rawCard.Rarity),
    number: extractNumber(rawCard),
    name: rawCard["Product Name"],
  };
};

const processCards = (
  cardData: RawTCGPlayerCardData[],
  setData: RawSetData[]
): CardData[] => {
  const cards = cardData.map((c) => {
    const set = findSetForCard(c, setData);
    if (!set) {
      return undefined;
    }

    if (c.Number === "") {
      return undefined;
    }
    return processCard(c, set);
  });

  const validCards = cards.filter((c) => c !== undefined);
  return validCards;
};

const processSeries = (
  listFromCards: string[],
  tcgDexSeries: SerieList | undefined
): OutputSeriesData[] => {
  console.log(
    "dexnames",
    tcgDexSeries?.map((t) => t.name)
  );
  console.log("seriesNames", listFromCards);
  if (!tcgDexSeries) {
    throw new Error("Empty tcgDex data");
  }
  return listFromCards
    .filter((seriesName: string) => {
      const foundSeries = tcgDexSeries.find(
        (s) => s.name.toLowerCase() === seriesName.toLowerCase()
      );
      return foundSeries !== undefined;
    })
    .map<OutputSeriesData>((seriesName): OutputSeriesData => {
      const foundSeries = tcgDexSeries.find(
        (s) => s.name.toLowerCase() === seriesName.toLowerCase()
      );
      return {
        name: seriesName,
        logo: foundSeries!.logo + ".png",
        rawTcgDexSeriesData: foundSeries!,
      };
    });
};

/**
 * argv[2] = Path to tcgplayer_card_data.csv (the raw output from TCGPlayer's Pricing export)
 * argv[3] = Path to sets.json data from https://github.com/PokemonTCG/pokemon-tcg-data/blob/master/sets/en.json
 * argv[4] = Path to output folder which will contain: Series, Set, Card data. This is later consumed for DB seeding
 */
async function doConvert() {
  if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
    console.log(process.argv);
    throw new Error("Required args missing");
  }

  console.log("Called with args:", process.argv);

  // Read TCGPlayer Card Data
  const tcgPlayerCardDataPath = path.join(process.cwd(), process.argv[2]);
  const tcgPlayerCardData = await readCsvFile<RawTCGPlayerCardData>(
    tcgPlayerCardDataPath
  );
  console.log(
    "1 card, randomly",
    tcgPlayerCardData[Math.floor(Math.random() * tcgPlayerCardData.length)]
  );
  console.log("unique conditions", uniqueBy(tcgPlayerCardData, "Condition"));

  // Read Set Data
  const setDataPath = path.join(process.cwd(), process.argv[3]);
  const setData = await readJsonFile<RawSetData>(setDataPath);

  // Process Series
  const allSeries = await tcgdex.fetch("series");
  const seriesList = uniqueBy(setData, "series");
  const processedSeries = processSeries(seriesList, allSeries);

  // Process Cards
  const outputCardData = processCards(tcgPlayerCardData, setData);

  // Write everything out
  const outputFolder = path.join(process.cwd(), process.argv[4]);
  writeSeriesData(outputFolder, processedSeries);
  writeSetData(outputFolder, setData);
  writeCardData(outputFolder, outputCardData);
}

doConvert();
