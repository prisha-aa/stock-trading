import { CompanyProfile } from "../domain/models/CompanyProfile";
import { ExternalApiDataProviderPort } from "../domain/ports/ExternalApiDataProviderPort";

export class GetCompanyProfileUseCase {
    constructor(private readonly marketDataProvider: ExternalApiDataProviderPort) {}

    async execute(symbol: string): Promise<CompanyProfile | null> {
        return this.marketDataProvider.getCompanyProfile(symbol);
    }
}