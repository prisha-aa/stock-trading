import { SymbolSubscription } from "../domain/ports/SymbolSubscription";

export class SymbolSubscriptionUseCase implements SymbolSubscription {
        private symbolToClients= new Map<string, Set<string>>();
        private clientToSymbols= new Map<string, Set<string>>();
        async subscribe(clientId: string, symbol: string): Promise<void> {
    if (!this.symbolToClients.has(symbol)) this.symbolToClients.set(symbol, new Set());
    this.symbolToClients.get(symbol)!.add(clientId);

    if (!this.clientToSymbols.has(clientId)) this.clientToSymbols.set(clientId, new Set());
    this.clientToSymbols.get(clientId)!.add(symbol);
  }

  async unsubscribe(clientId: string, symbol: string): Promise<void> {
    this.symbolToClients.get(symbol)?.delete(clientId);
    this.clientToSymbols.get(clientId)?.delete(symbol);
  }

  async unsubscribeAll(clientId: string): Promise<void> {
    const symbols = this.clientToSymbols.get(clientId);
    if (!symbols) return;

    for (const symbol of symbols) {
      this.symbolToClients.get(symbol)?.delete(clientId);
    }
    this.clientToSymbols.delete(clientId);
  }

  getClientsFor(symbol: string): string[] {
    return [...(this.symbolToClients.get(symbol) || [])];
  }
}
