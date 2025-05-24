import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { JsonLogger, LoggerFactory } from 'json-logger-service';

import { IEmailEventsPublisher } from '../iemail-events-publisher.interface';
import { EmailOrderStatusChangeDto } from '../dto';

@Injectable()
export class EmailEventsSnsPublisher implements IEmailEventsPublisher {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(
    EmailEventsSnsPublisher.name,
  );

  private readonly snsClient: SNSClient;
  private readonly AWS_CREDENTIALS;
  private readonly AWS_SNS_TOPICS_ARN;

  constructor(private configService: ConfigService) {
    this.AWS_CREDENTIALS = {
      ACCESS_KEY: this.configService.get<string>('aws.access_key'),
      SECRET_ACCESS_KEY: this.configService.get<string>(
        'aws.secret_access_key',
      ),
      REGION: this.configService.get<string>('aws.region'),
    };

    this.AWS_SNS_TOPICS_ARN = {
      ORDER_PAYMENT: process.env.AWS_SNS_ORDER_PAYMENT,
      EMAIL_PASSWORD_RESET: process.env.AWS_SNS_EMAIL_PASSWORD_RESET,
      EMAIL_ORDER_STATUS_CHANGE: process.env.AWS_SNS_EMAIL_ORDER_STATUS_CHANGE,
      EMAIL_ORDER_CREATED: process.env.AWS_SNS_EMAIL_ORDER_CREATED,
      EMAIL_ORDER_INVOICE: process.env.AWS_SNS_EMAIL_ORDER_INVOICE,
    };

    this.snsClient = new SNSClient({
      credentials: {
        accessKeyId: this.AWS_CREDENTIALS.ACCESS_KEY,
        secretAccessKey: this.AWS_CREDENTIALS.SECRET_ACCESS_KEY,
      },
      region: this.AWS_CREDENTIALS.REGION,
    });

    this.logger.info('Init EmailEventsSnsPublisher');
  }

  public async emitEmailPasswordResetMessage(payload: any): Promise<void> {
    this.logger.info(`emitEmailPasswordResetMessage payload.: ${payload}`);
    this.logger.info(
      `TopicArn.: ${this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET}`,
    );

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      }),
    );

    this.logger.info(`SNS Response.: ${response}`);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET}`,
    );
  }

  public async emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): Promise<void> {
    console.log('emitEmailOrderStatusChangeMessage payload.:', payload);

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      }),
    );

    console.log('SNS response.:', response);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_STATUS_CHANGE}`,
    );
  }

  public emitEmailOrderCreatedChangeMessage(payload: any): void {
    console.log('emitEmailOrderCreatedChangeMessage payload.:', payload);

    const response = this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_CREATED,
      }),
    );

    console.log('SNS response.:', response);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_CREATED}`,
    );
  }

  public emitEmailOrderInvoiceMessage(payload: any): void {
    console.log('emitEmailOrderInvoiceMessage payload.:', payload);

    const response = this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_INVOICE,
      }),
    );

    console.log('SNS response.:', response);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_INVOICE}`,
    );
  }

  public emitEmailOrderReceiptMessage(payload: any): void {
    console.log('emitEmailOrderReceiptMessage payload.:', payload);

    const response = this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.ORDER_PAYMENT,
      }),
    );

    console.log('SNS response.:', response);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.ORDER_PAYMENT}`,
    );
  }
}
