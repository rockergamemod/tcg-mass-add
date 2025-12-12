import { TcgCard } from './tcg-card.entity';
import { CardFinishType, CardArtVariant } from './types';
import { TcgCardSource } from './tcg-card-source.entity';
export declare class TcgCardPrinting {
    id: number;
    card: TcgCard;
    finishType: CardFinishType;
    artVariant?: CardArtVariant;
    isDefault: boolean;
    source?: TcgCardSource;
}
