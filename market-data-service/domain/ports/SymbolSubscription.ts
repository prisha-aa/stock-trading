export interface SymbolSubscription {
  subscribe(clientId: string, symbol: string): Promise<void>;
  unsubscribe(clientId: string, symbol: string): Promise<void>;
  unsubscribeAll(clientId: string): Promise<void>;
  getClientsFor(symbol: string): string[];
}
