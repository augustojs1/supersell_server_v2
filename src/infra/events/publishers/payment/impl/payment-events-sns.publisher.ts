import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { JsonLogger, LoggerFactory } from 'json-logger-service';

import { MessagingTopics } from '../../../enum';
import { PaymentMessagePayload } from '../dto';
import { IPaymentEventsPublisher } from '../ipayment-events-publisher.interface';

@Injectable()
export class PaymentEventsSnsPublisher implements IPaymentEventsPublisher {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(
    PaymentEventsSnsPublisher.name,
  );
  private readonly snsClient: SNSClient;
  private readonly AWS_CREDENTIALS;
  private readonly AWS_SNS_PAYMENT_TOPIC_ARN: string;

  constructor(private readonly configService: ConfigService) {
    this.AWS_CREDENTIALS = {
      ACCESS_KEY: this.configService.get<string>('aws.access_key'),
      SECRET_ACCESS_KEY: this.configService.get<string>(
        'aws.secret_access_key',
      ),
      REGION: this.configService.get<string>('aws.region'),
    };
    this.AWS_SNS_PAYMENT_TOPIC_ARN = process.env.AWS_SNS_ORDER_PAYMENT;

    this.snsClient = new SNSClient({
      credentials: {
        accessKeyId: this.AWS_CREDENTIALS.ACCESS_KEY,
        secretAccessKey: this.AWS_CREDENTIALS.SECRET_ACCESS_KEY,
      },
      region: this.AWS_CREDENTIALS.REGION,
    });

    this.logger.info(
      {
        success: true,
      },
      'Init SNS topics publisher class PaymentEventsSnsPublisher',
    );
  }

  public async sendOrderPaymentMessage(
    payload: PaymentMessagePayload,
  ): Promise<void> {
    this.logger.info(
      { payload, topic: this.AWS_SNS_PAYMENT_TOPIC_ARN },
      `Receveid message to send on topic ${MessagingTopics.ORDER_PAYMENT}.`,
    );

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_PAYMENT_TOPIC_ARN,
      }),
    );

    this.logger.info(
      {
        body: payload,
        snsResponse: response,
        TopicArn: this.AWS_SNS_PAYMENT_TOPIC_ARN,
        TopicName: MessagingTopics.ORDER_PAYMENT,
      },
      `SUCCESS publishing message on topic ${MessagingTopics.ORDER_PAYMENT}`,
    );
  }
}
