import { Quote } from "../models/Quote";

export interface QuoteListenerPort {
    onQuote(quote: Quote): void;
}