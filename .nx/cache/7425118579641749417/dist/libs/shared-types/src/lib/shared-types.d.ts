export interface TcgCardSourceInterface {
    id: number;
    sourceCardId: string;
    sourceSetCode?: string;
    sourceSetName?: string;
    sourceName?: string;
    rawExtra?: Record<string, any>;
    isPrimary: boolean;
}
