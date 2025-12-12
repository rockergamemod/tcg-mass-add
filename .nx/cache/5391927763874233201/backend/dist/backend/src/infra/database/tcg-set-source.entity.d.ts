import { TcgSet } from './tcg-set.entity';
import { CardSourceType } from './types';
export declare class TcgSetSource {
    id: number;
    set: TcgSet;
    source: CardSourceType;
    sourceSetId: string;
    sourceSetCode?: string;
    sourceSetName?: string;
    rawExtra?: Record<string, any>;
    isPrimary: boolean;
}
