export interface CompanyProfile {
    symbol: string;
    companyName: string;
    exchange: string;
    industry: string;
    website: string;
    ceo?: string;
    employees?: number;
    financials: {
        revenue: number;
        netIncome: number;
        marketCap: number;
    };}