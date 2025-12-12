import { TcgCard } from './tcg-card.entity';
import { CardSourceType } from './types';
import { TcgCardSourceInterface } from '@tcgplayer-mass-add/shared-types';
export declare class TcgCardSource implements TcgCardSourceInterface {
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
