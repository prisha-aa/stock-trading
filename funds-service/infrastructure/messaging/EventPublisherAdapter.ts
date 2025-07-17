import AWS from "aws-sdk";
import { EventPublisherPort } from "../../domain/ports/EventPublisherPort";

export class EventPublisherAdapter implements EventPublisherPort {
  private sns: AWS.SNS;
  private topicArn: string;

  constructor(region: string, topicArn: string) {
    AWS.config.update({ region });
    this.sns = new AWS.SNS();
    this.topicArn = topicArn;
  }

  async publish(eventName: string, data: any): Promise<void> {
    const message = JSON.stringify({ eventName, data });

    const params = {
      TopicArn: this.topicArn,
      Message: message,
    };

    try {
      await this.sns.publish(params).promise();
      console.log(`Event '${eventName}' published to SNS topic ${this.topicArn}`);
    } catch (error) {
      console.error(`Error publishing event '${eventName}' to SNS:`, error);
      throw error;
    }
  }
}
