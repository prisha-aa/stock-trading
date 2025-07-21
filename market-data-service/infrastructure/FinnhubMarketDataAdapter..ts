import { ExternalApiDataProviderPort} from "../domain/ports/ExternalApiDataProviderPort";
import axios from "axios";
import { CompanyProfile } from "../domain/models/CompanyProfile";
import { HistoricalData } from "../domain/models/HistoricalData";





const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export class MarketDataAdapter implements ExternalApiDataProviderPort {

    private readonly EODHD_apiToken: string;
    private readonly FINNHUB_apiToken: string;
      constructor(EODHD_apiToken: string, FINNHUB_apiToken: string) {
        this.FINNHUB_apiToken = FINNHUB_apiToken;
        this.EODHD_apiToken = EODHD_apiToken;

      }


    async getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
        try{
//             if (!FINNHUB_API_KEY) {
//   throw new Error("Missing FINNHUB_API_KEY in environment");
  
// }
// else {
//     console.log("🔑 FINNHUB_API_KEY found in environment");
// }
            const profileRes = await axios.get(`${FINNHUB_BASE_URL}/stock/profile2`, {
        params: { symbol, token: this.FINNHUB_apiToken }
      });
      const metricsRes = await axios.get(`${FINNHUB_BASE_URL}/stock/metric`, {
        params: { symbol, metric: "all", token: this.FINNHUB_apiToken }
      });
      const profile = profileRes.data;
      const metrics = metricsRes.data.metric;
      return {
        symbol,
        companyName: profile.name,
        exchange: profile.exchange,
        industry: profile.finnhubIndustry,
        website: profile.weburl,
        ceo: profile.ceo,
        employees: profile.employees,
        financials: {
          revenue: metrics.revenueTTM,
          netIncome: metrics.netIncomeTTM,
          marketCap: metrics.marketCapitalization * 1_000_000
        }
      };
    } catch (error) {
      console.error("Finnhub getCompanyProfile error", error);
      return null;
    }


    }


    
    

      async getHistoricalData(symbol: string, from: string, to: string, period: string = "d"): Promise<HistoricalData | null> {
        try {
          const url = `https://eodhd.com/api/eod/${symbol}?from=${from}&to=${to}&period=${period}&api_token=${this.EODHD_apiToken}&fmt=json`;
          const response = await axios.get(url);
          console.log("🚨 Raw EODHD response:", JSON.stringify(response.data, null, 2));

          return response.data.map((item:any) => ({
            date: item.date,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,            
            volume: item.volume,
          }));
          
        }
        catch (error) {
          console.error("EODHD getHistoricalData error", error);
          return null;
        }
      }
    }

      