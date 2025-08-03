import { Quote } from "../../../domain/models/Quote";
import { QuotePublisherPort } from "../../../domain/ports/QuotePublisherPort";
import  Pusher  from "pusher";

export class PusherQuotePublisher  implements QuotePublisherPort {
    constructor (private readonly pusher: Pusher){}
    async publish (clientId:string, quote:Quote):Promise<void>{
        const channel = `client-${clientId}`;
         console.log(`[Pusher] 📤 Sending quote to ${channel}:`, quote);
       await this.pusher.trigger(`client-${clientId}`, "quote-update", quote);
}}