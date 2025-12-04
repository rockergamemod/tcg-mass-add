// Parse the Raw TCGPlayer export and turn them into typed RawTcgplayerCard entries.
import fs from 'node:fs';
import { parse } from 'csv-parse';

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

export interface TcgplayerCsvRow {
  tcgplayerProductId: string;
  productLine: string;
  setName: string;
  productName: string;
  title: string;
  number: string;
  rarity: string;
  condition: string;
  tcgMarketPrice: string;
}

export async function parseTcgplayerCsv(
  filePath: string,
): Promise<TcgplayerCsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: TcgplayerCsvRow[] = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          trim: true,
          skip_empty_lines: true,
        }),
      )
      .on('data', (record: RawTCGPlayerCardData) => {
        rows.push({
          tcgplayerProductId: record['TCGplayer Id'],
          productLine: record['Product Line'],
          setName: record['Set Name'],
          productName: record['Product Name'],
          title: record['Title'],
          number: record['Number'],
          rarity: record['Rarity'],
          condition: record['Condition'],
          tcgMarketPrice: record['TCG Market Price'],
        });
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}
