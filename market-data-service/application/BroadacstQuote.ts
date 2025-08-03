import { Quote } from "../domain/models/Quote";
import { QuotePublisherPort } from "../domain/ports/QuotePublisherPort";

export class BroadcastQuote {
    constructor(private readonly publisher: QuotePublisherPort) {}
    async execute(clientId:string, quote: Quote): Promise<void> {
        await this.publisher.publish(clientId, quote);
        console.log(" Broadcast quote", quote);
    }
}