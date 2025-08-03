import { Quote } from "../models/Quote";

export interface QuotePublisherPort {
    publish(clientId: string, quote: Quote): Promise<void>;
}