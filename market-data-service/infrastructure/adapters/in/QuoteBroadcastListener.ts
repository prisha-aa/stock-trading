import { BroadcastQuote } from "../../../application/BroadacstQuote";
import { SymbolSubscriptionUseCase } from "../../../application/SymbolSubscriptionUseCase";
import { Quote } from "../../../domain/models/Quote";
import { QuoteListenerPort } from "../../../domain/ports/QuoteListenerPort";

export class QuoteBroadcastListener implements QuoteListenerPort {
    private lastPrices: Map<string,number> = new Map();
  constructor(
    private readonly registry: SymbolSubscriptionUseCase,
    private readonly broadcaster: BroadcastQuote
  ) {}

  onQuote(quote: Quote): void {
    const prevPrice= this.lastPrices.get(quote.symbol);
    if (prevPrice !== undefined && prevPrice !== 0) {
      quote.change = quote.price - prevPrice;
      quote.changePercent = (quote.change / prevPrice) * 100;
    } else {
      quote.change = 0;
      quote.changePercent = 0;
    }

    this.lastPrices.set(quote.symbol, quote.price);
    const clients = this.registry.getClientsFor(quote.symbol);
    console.log(`[Broadcast]  Clients for ${quote.symbol}:`, clients);
    clients.forEach((clientId) => this.broadcaster.execute(clientId, quote));
  }
}