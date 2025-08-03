import { Quote } from "../../../domain/models/Quote";
import { QuoteListenerPort } from "../../../domain/ports/QuoteListenerPort";
import WebSocket from "ws";

export class FinnhubWebSocket {
  private socket!: WebSocket;
  private activeSymbols: Set<string> = new Set();

  constructor(
    private readonly apiKey: string,
    private readonly listener: QuoteListenerPort
  ) {}

  connect(): void {
    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`);

    this.socket.on("open", () => {
      console.log("Connected to Finnhub");
    });

    this.socket.on("message", (data: string) => {
      const parsed = JSON.parse(data);
      console.log("[Finnhub Raw Message]:", parsed);
      if (parsed.type === "trade" && parsed.data) {
        for (const trade of parsed.data) {
          const quote: Quote = {
            symbol: trade.s,
            price: trade.p,
            volume: trade.v,
            timestamp: trade.t,
          };
          console.log("[Finnhub] Quote received:", quote);
          this.listener.onQuote(quote);
        }
      }
    });

    this.socket.on("error", console.error);
    this.socket.on("close", () => {
      console.warn("Connection closed. Reconnecting...");
      setTimeout(() => this.connect(), 3000);
    });
  }

  subscribe(symbol: string): void {
    if (!this.activeSymbols.has(symbol)) {
      this.activeSymbols.add(symbol);
    //   this.socket.send(JSON.stringify({ type: "subscribe", symbol }));
    //   console.log(`[Finnhub]  Subscribed to: ${symbol}`);
    const message = JSON.stringify({ type: "subscribe", symbol });
    console.log(`[Finnhub]  Sending subscription: ${message}`); // ✅ ADD THIS
    this.socket.send(message);
    }
  }

  unsubscribe(symbol: string): void {
    if (this.activeSymbols.has(symbol)) {
      this.activeSymbols.delete(symbol);
      this.socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  }
}
