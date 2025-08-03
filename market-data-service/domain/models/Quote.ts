export interface Quote {
    symbol: string;
    price: number;
    volume?: number;
    timestamp?: number;
    change?: number;
    changePercent?: number;
}