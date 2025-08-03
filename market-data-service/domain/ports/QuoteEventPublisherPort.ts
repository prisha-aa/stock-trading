import { Quote } from "../models/Quote";

export interface QuoteEventPublisherPort {
    publish(quote: Quote): Promise<void>;
}