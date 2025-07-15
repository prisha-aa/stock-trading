import AWS from "aws-sdk";
import { EventPublisherPort } from "../../domain/ports/EventPublisherPort";

type EventTopicMap = {
  [eventName: string]: string;
};

export class EventPublisherAdapter implements EventPublisherPort {
  private sns: AWS.SNS;
  private topicMap: EventTopicMap;

  constructor(region: string, topicMap: EventTopicMap) {
    AWS.config.update({ region });
    this.sns = new AWS.SNS();
    this.topicMap = topicMap;
  }

  async publish(eventName: string, data: any): Promise<void> {
    const topicArn = this.topicMap[eventName];
    if (!topicArn) {
      throw new Error(`No topic ARN configured for event '${eventName}'`);
    }

    const message = JSON.stringify({ eventName, data });

    const params = {
      TopicArn: topicArn,
      Message: message,
    };

    try {
      await this.sns.publish(params).promise();
      console.log(`Event '${eventName}' published to SNS topic ${topicArn}`);
    } catch (error) {
      console.error(` Error publishing event '${eventName}' to SNS:`, error);
      throw error;
    }
  }
}
