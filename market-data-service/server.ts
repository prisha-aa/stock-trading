import express from "express";
import dotenv from "dotenv";

import { GetCompanyProfileUseCase } from "./application/GetCompanyProfileUseCase";
import { GetHistoricalDataUseCase } from "./application/GetHistoricalDataUseCase";
import { MarketDataAdapter } from "./infrastructure/FinnhubMarketDataAdapter.";
import { MarketdataController } from "./infrastructure/MarketDataController";


dotenv.config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
 const EODHD_API_KEY = process.env.EODHD_API_KEY!;

const app = express();
const port = process.env.PORT || 3004;

const provider = new MarketDataAdapter(EODHD_API_KEY, FINNHUB_API_KEY);

const companyUseCase = new GetCompanyProfileUseCase(provider);
const historyUseCase = new GetHistoricalDataUseCase(provider);

app.use(express.json());
app.use("/", MarketdataController(companyUseCase, historyUseCase));

app.listen(port, () => {
  console.log(`Market Data Service running on port ${port}`);
});
