import AWS from "aws-sdk";
import { CreateTransactionUseCase } from "../../application/CreateTransaction";
import { FundDomainService } from "../../domain/FundDomainService";
import { UserBalanceRepositoryPort } from "../../domain/ports/UserBalanceRepositrory";



const sqs = new AWS.SQS({ region: "us-east-1" });
const QUEUE_URL = process.env.ORDER_PLACED_QUEUE_URL!;

export class OrderPlacedListener {
  constructor(
    private fundDomainService: FundDomainService,
    private userBalanceRepository: UserBalanceRepositoryPort
  ) {}

  async listen() {
    const params = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    };

    while (true) {
      const response = await sqs.receiveMessage(params).promise();
      if (response.Messages) {
        for (const message of response.Messages) {
          try {
            const body = JSON.parse(message.Body!);
            const { orderId, userId, amount,type } = body.data;
            if (type==="buy"){
            const balance = await this.userBalanceRepository.getBalance(userId);
            await this.fundDomainService.validateTransaction(type, amount, balance);
            const newBalance=await this.fundDomainService.deductBalance(amount, balance);
            await this.userBalanceRepository.updateBalance(userId, newBalance);
            console.log(` Deducted ₹${amount} from user ${userId} for order ${orderId}`);
            } else {
              console.log(` No balance change for '${type}' order ${orderId}`);
            }
            


        
            await sqs.deleteMessage({
              QueueUrl: QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle!,
            }).promise();
          } catch (err) {
            console.error("Error handling message:", err);
          }
        }
      }
    }
  }
}
