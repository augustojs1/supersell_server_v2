import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MessagingTopics } from '@/infra/events/enum';
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

    this.logger.info(
      {
        success: true,
      },
      'Init SNS topics publisher class EmailEventsSnsPublisher',
    );
  }

  public async emitEmailPasswordResetMessage(payload: any): Promise<void> {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      },
      'emitEmailPasswordResetMessage',
    );

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      }),
    );

    this.logger.info(
      {
        body: payload,
        snsResponse: response,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
        TopicName: MessagingTopics.EMAIL_PASSWORD_RESET,
      },
      `Publish message on topic  ${MessagingTopics.EMAIL_PASSWORD_RESET}`,
    );
  }

  public async emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): Promise<void> {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_STATUS_CHANGE,
      },
      'emitEmailOrderStatusChangeMessage',
    );

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_STATUS_CHANGE,
      }),
    );

    this.logger.info(
      {
        body: payload,
        snsResponse: response,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_STATUS_CHANGE,
        TopicName: MessagingTopics.EMAIL_ORDER_STATUS_CHANGE,
      },
      `Publish message on topic  ${MessagingTopics.EMAIL_ORDER_STATUS_CHANGE}`,
    );
  }

  public emitEmailOrderCreatedChangeMessage(payload: any): void {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_CREATED,
      },
      'emitEmailOrderCreatedChangeMessage',
    );

    const response = this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_CREATED,
      }),
    );

    this.logger.info(
      {
        body: payload,
        snsResponse: response,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
        TopicName: MessagingTopics.EMAIL_ORDER_CREATED,
      },
      `Publish message on topic  ${MessagingTopics.EMAIL_ORDER_CREATED}`,
    );
  }

  public emitEmailOrderInvoiceMessage(payload: any): void {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_INVOICE,
      },
      'emitEmailOrderInvoiceMessage',
    );

    const response = this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_INVOICE,
      }),
    );

    this.logger.info(
      {
        body: payload,
        snsResponse: response,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
        TopicName: MessagingTopics.EMAIL_ORDER_INVOICE,
      },
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_INVOICE}`,
    );
  }

  public emitEmailOrderReceiptMessage(payload: any): void {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      },
      'emitEmailOrderReceiptMessage',
    );

    const response = this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.ORDER_PAYMENT,
      }),
    );

    this.logger.info(
      {
        body: payload,
        snsResponse: response,
        TopicName: MessagingTopics.ORDER_PAYMENT,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      },
      `Publish message on topic ${MessagingTopics.ORDER_PAYMENT}`,
    );
  }
}
