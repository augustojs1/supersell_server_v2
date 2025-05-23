import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { JsonLogger, LoggerFactory } from 'json-logger-service';

import { IEmailEventsPublisher } from '../iemail-events-publisher.interface';
import { EmailOrderStatusChangeDto } from '../dto';

export class EmailEventsSnsPublisher implements IEmailEventsPublisher {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(
    EmailEventsSnsPublisher.name,
  );

  private readonly snsClient: SNSClient;

  private readonly AWS_CREDENTIALS = {
    S3_BUCKET: this.configService.get<string>('aws.s3_bucket'),
    ACCESS_KEY: this.configService.get<string>('aws.access_key'),
    SECRET_ACCESS_KEY: this.configService.get<string>('aws.secret_access_key'),
    REGION: this.configService.get<string>('aws.region'),
  };

  private readonly AWS_SNS_TOPICS_ARN = {
    ORDER_PAYMENT: this.configService.get<string>(
      'aws.sns_topics.order_payment',
    ),
    EMAIL_PASSWORD_RESET: this.configService.get<string>(
      'aws.sns_topics.email_order_password_reset',
    ),
    EMAIL_ORDER_STATUS_CHANGE: this.configService.get<string>(
      'aws.sns_topics.email_order_status_change',
    ),
    EMAIL_ORDER_CREATED: this.configService.get<string>(
      'aws.sns_topics.email_order_created',
    ),
    EMAIL_ORDER_INVOICE: this.configService.get<string>(
      'aws.sns_topics.email_order_invoice',
    ),
  };

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      credentials: {
        accessKeyId: this.AWS_CREDENTIALS.ACCESS_KEY,
        secretAccessKey: this.AWS_CREDENTIALS.SECRET_ACCESS_KEY,
      },
      region: this.AWS_CREDENTIALS.REGION,
    });
  }

  public emitEmailPasswordResetMessage(payload: any): void {
    console.log('emitEmailPasswordResetMessage payload.:', payload);

    const response = this.snsClient.send(
      new PublishCommand({
        Message: payload,
        TopicArn: this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET,
      }),
    );

    console.log('sns response.:', response);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.EMAIL_PASSWORD_RESET}`,
    );
  }

  public emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): void {
    console.log('emitEmailOrderStatusChangeMessage payload.:', payload);

    const response = this.snsClient.send(
      new PublishCommand({
        Message: payload as any,
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
        Message: payload as any,
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
        Message: payload as any,
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
        Message: payload as any,
        TopicArn: this.AWS_SNS_TOPICS_ARN.ORDER_PAYMENT,
      }),
    );

    console.log('SNS response.:', response);

    this.logger.info(
      `Publish message on topic ${this.AWS_SNS_TOPICS_ARN.ORDER_PAYMENT}`,
    );
  }
}
