import { TcgCard } from './tcg-card.entity';
import { CardSourceType } from './types';
export declare class TcgCardSource {
    id: number;
    card: TcgCard;
    source: CardSourceType;
    sourceCardId: string;
    sourceSetCode?: string;
    sourceSetName?: string;
    sourceName?: string;
    rawExtra?: Record<string, any>;
    isPrimary: boolean;
}
