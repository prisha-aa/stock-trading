import { CompanyProfile } from "../models/CompanyProfile";
import { HistoricalData } from "../models/HistoricalData";

export interface ExternalApiDataProviderPort {
    // getQuotes(symbols: string[]): Promise<Quote[]>;
    getHistoricalData(symbol: string, from: string, to: string, period?: string): Promise<HistoricalData | null>;
    getCompanyProfile(symbol: string,): Promise<CompanyProfile | null>;
}