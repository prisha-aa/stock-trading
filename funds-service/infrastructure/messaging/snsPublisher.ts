import {
  SNSClient,
  PublishBatchCommand,
  PublishBatchRequestEntry
} from "@aws-sdk/client-sns";



const sns = new SNSClient({ region: "ap-south-1" }); 
const TOPIC_ARN = process.env.SNS_TOPIC_ARN!;
const MAX_BATCH=10;

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}


export async function publishEventsToSNS(events: any[]) {
  const chunks = chunk(events, MAX_BATCH);

  for (const chunked of chunks) {
    const entries: PublishBatchRequestEntry[] = chunked.map((event, i) => ({
      Id: event.id.toString(),
      Message: JSON.stringify(event.payload),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: event.event_type,
        }
      },
    }));

await sns.send(new PublishBatchCommand({
      TopicArn: TOPIC_ARN!,
      PublishBatchRequestEntries: entries
    }));
  }
  console.log(`Published ${events.length} events`);
}