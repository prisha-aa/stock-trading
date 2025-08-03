import express from "express";
import dotenv from "dotenv";

import { GetCompanyProfileUseCase } from "./application/GetCompanyProfileUseCase";
import { GetHistoricalDataUseCase } from "./application/GetHistoricalDataUseCase";
import { MarketDataAdapter } from "./infrastructure/adapters/FinnhubMarketDataAdapter.";

import { SymbolSubscriptionUseCase } from "./application/SymbolSubscriptionUseCase";
import { PusherQuotePublisher } from "./infrastructure/adapters/out/PusherQuotePublisher";
import Pusher from "pusher";
import { BroadcastQuote } from "./application/BroadacstQuote";
import { QuoteBroadcastListener } from "./infrastructure/adapters/in/QuoteBroadcastListener";
import { FinnhubWebSocket } from "./infrastructure/adapters/in/FinnhubWebSocket";
import { MarketdataController } from "./infrastructure/adapters/in/MarketDataController";
import { createSubscriptionController } from "./infrastructure/adapters/in/SubscriptionController";


dotenv.config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
 const EODHD_API_KEY = process.env.EODHD_API_KEY!;

const app = express();
const port = process.env.PORT || 3004;

const provider = new MarketDataAdapter(EODHD_API_KEY, FINNHUB_API_KEY);
const registry= new SymbolSubscriptionUseCase();
const publisher= new PusherQuotePublisher(
  new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  })
)
const broadcaster = new BroadcastQuote(publisher);
const quoteListener = new QuoteBroadcastListener(registry, broadcaster);
const finnhub= new FinnhubWebSocket(process.env.FINNHUB_API_KEY!, quoteListener);

const companyUseCase = new GetCompanyProfileUseCase(provider);
const historyUseCase = new GetHistoricalDataUseCase(provider);
finnhub.connect();

app.use(express.json());
app.use("/market", MarketdataController(companyUseCase, historyUseCase));
app.use("/subscription", createSubscriptionController(registry, finnhub));

app.listen(port, () => {
  console.log(`Market Data Service running on port ${port}`);
});
