import fs from "fs";
import path from "path";
import csv from "csv-parser";

import setData from "./sets.json";

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

export type Printing = "normal" | "holo" | "reverse";
export type Rarity =
  | "Promo"
  | "Common"
  | "Rare"
  | "Holo Rare"
  | "Uncommon"
  | "Secret Rare"
  | "Ultra Rare"
  | "Shiny Holo Rare"
  | "Code Card"
  | "Unconfirmed"
  | "Rare Ace"
  | "Classic Collection"
  | "Radiant Rare"
  | "Prism Rare"
  | "Double Rare"
  | "Illustration Rare"
  | "Special Illustration Rare"
  | "Mega Hyper Rare"
  | "ACE SPEC Rare"
  | "Amazing Rare"
  | "Black White Rare"
  | "Shiny Rare"
  | "Shiny Ultra Rare"
  | "Hyper Rare"
  | "Rare BREAK";

export interface CardData {
  rawTCGPlayerData: RawTCGPlayerCardData;
  set: RawSetData;
  printing: Printing;
  rarity: Rarity;
  number: string;
  name: string;
}

const readFile = (filepath: string): Promise<RawTCGPlayerCardData[]> => {
  return new Promise((resolve) => {
    const results: RawTCGPlayerCardData[] = [];
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
};

const uniqueBy = (
  rawTCGData: RawTCGPlayerCardData[],
  key: keyof RawTCGPlayerCardData
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

const partitionBySet = (
  rawTCGData: RawTCGPlayerCardData[]
): Record<string, RawTCGPlayerCardData[]> => {
  return rawTCGData.reduce<Record<string, RawTCGPlayerCardData[]>>(
    (acc, card) => {
      const setName = card["Set Name"];
      const matchingSet = setData.find((s) => s.name === setName);
      if (!matchingSet) {
        throw new Error("Unable to match set to code");
      }

      if (acc[setName]) {
        acc[setName].push(card);
      } else {
        acc[setName] = [card];
      }
      return acc;
    },
    {}
  );
};

async function doConvert() {
  if (process.argv[2] && process.argv[3]) {
    console.log("args", process.argv);
    const input = path.join(process.cwd(), process.argv[2]);
    console.log("input", input);
    const data = await readFile(input);

    console.log("=== rarity ===", uniqueBy(data, "Rarity"));

    const partitionedData = partitionBySet(data);

    const output = path.join(process.cwd(), process.argv[3]);
    console.log("output", output);
    console.log(data);

    fs.writeFileSync(output, JSON.stringify(data));
  } else {
    console.log("missing args", process.argv);
  }
}

doConvert();
