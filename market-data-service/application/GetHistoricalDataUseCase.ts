import { HistoricalData } from "../domain/models/HistoricalData";
import { ExternalApiDataProviderPort } from "../domain/ports/ExternalApiDataProviderPort";

export class GetHistoricalDataUseCase {
    constructor(private readonly marketDataProvider: ExternalApiDataProviderPort) {}

    async execute(symbol: string, from: string, to: string, period: string="d"): Promise<HistoricalData | null> {
        return this.marketDataProvider.getHistoricalData(symbol, from, to, period);
    }
}