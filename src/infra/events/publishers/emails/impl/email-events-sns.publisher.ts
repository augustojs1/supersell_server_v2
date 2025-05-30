import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MessagingTopics } from '@/infra/events/enum';
import { JsonLogger, LoggerFactory } from 'json-logger-service';

import { IEmailEventsPublisher } from '../iemail-events-publisher.interface';
import { EmailOrderStatusChangeDto } from '../dto';
import { OrderReceiptEventPayload, PasswordResetEventPayload } from '../models';
import { PasswordResetEventDto } from '../dto/password-reset-event.dto';
import { OrderReceiptEventDto } from '../dto/order-receipt-event.dto';

@Injectable()
export class EmailEventsSnsPublisher implements IEmailEventsPublisher {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(
    EmailEventsSnsPublisher.name,
  );

  private readonly snsClient: SNSClient;
  private readonly AWS_CREDENTIALS;
  private readonly AWS_SNS_TOPICS_ARN;

  constructor(private readonly configService: ConfigService) {
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

  public async emitEmailPasswordResetMessage(
    payload: PasswordResetEventPayload,
  ): Promise<void> {
    const formatedPayload: PasswordResetEventDto = {
      topic_name: MessagingTopics.EMAIL_PASSWORD_RESET,
      ...payload,
    };

    this.logger.info(
      {
        body: formatedPayload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      },
      'emitEmailPasswordResetMessage',
    );

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(formatedPayload),
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      }),
    );

    this.logger.info(
      {
        body: formatedPayload,
        snsResponse: response,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
        TopicName: MessagingTopics.EMAIL_PASSWORD_RESET,
      },
      `Publish message on topic ${MessagingTopics.EMAIL_PASSWORD_RESET}`,
    );
  }

  public async emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): Promise<void> {
    payload.topic_name = MessagingTopics.EMAIL_ORDER_STATUS_CHANGE;

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

  public async emitEmailOrderCreatedChangeMessage(payload: any): Promise<void> {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_CREATED,
      },
      'emitEmailOrderCreatedChangeMessage',
    );

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(payload),
        TopicArn: process.env.AWS_SNS_EMAIL_ORDER_CREATED,
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

  public async emitEmailOrderInvoiceMessage(payload: any): Promise<void> {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_ORDER_INVOICE,
      },
      'emitEmailOrderInvoiceMessage',
    );

    const response = await this.snsClient.send(
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

  public async emitEmailOrderReceiptMessage(
    payload: OrderReceiptEventPayload,
  ): Promise<void> {
    this.logger.info(
      {
        body: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.AWS_SNS_EMAIL_ORDER_CREATED,
      },
      'emitEmailOrderReceiptMessage',
    );

    const formatedPayload: OrderReceiptEventDto = {
      topic_name: MessagingTopics.EMAIL_ORDER_CREATED,
      ...payload,
    };

    const response = await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(formatedPayload),
        TopicArn: process.env.AWS_SNS_EMAIL_ORDER_CREATED,
      }),
    );

    this.logger.info(
      {
        body: formatedPayload,
        snsResponse: response,
        TopicName: MessagingTopics.EMAIL_ORDER_CREATED,
        TopicArn: this.AWS_SNS_TOPICS_ARN.AWS_SNS_EMAIL_ORDER_CREATED,
      },
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_CREATED}`,
    );
  }
}
