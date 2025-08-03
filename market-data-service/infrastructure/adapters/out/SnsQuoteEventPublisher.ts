import { Quote } from "../../../domain/models/Quote";
import { QuoteEventPublisherPort } from "../../../domain/ports/QuoteEventPublisherPort";
import { SNS } from "aws-sdk";

export class SnsQuoteEventPublisher implements QuoteEventPublisherPort {
    constructor(
    private readonly snsClient: SNS,
    private readonly topicArn: string
  ) {}

  async publish(quote: Quote): Promise<void> {
    await this.snsClient
      .publish({
        TopicArn: this.topicArn,
        Message: JSON.stringify(quote),
        MessageAttributes: {
          eventType: {
            DataType: "String",
            StringValue: "quote-updated",
          },
        },
      })
      .promise();
  }
}