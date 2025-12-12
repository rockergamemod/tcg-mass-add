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
export declare function parseTcgplayerCsv(filePath: string): Promise<TcgplayerCsvRow[]>;
