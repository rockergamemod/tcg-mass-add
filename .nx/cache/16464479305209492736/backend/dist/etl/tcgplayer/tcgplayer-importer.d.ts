import { EntityManager } from '@mikro-orm/postgresql';
import { TcgplayerCsvRow } from './tcgplayer-csv-parser';
import { CardArtVariant, CardFinishType, GameKey } from 'src/infra/database/types';
interface ImportOptions {
    gameKey?: GameKey;
}
export declare function removeLeadingZeroes(numericString: string): string;
export declare function extractArtVariantFromRow(row: TcgplayerCsvRow, cardFinish: CardFinishType | undefined): CardArtVariant;
export declare function importTcgplayerCsvRows(em: EntityManager, rows: TcgplayerCsvRow[], opts?: ImportOptions): Promise<void>;
export declare function main(): Promise<void>;
export {};
