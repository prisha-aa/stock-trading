export interface HistoricalData {
    symbol: string;
    history:{
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;     
        }[];
    }