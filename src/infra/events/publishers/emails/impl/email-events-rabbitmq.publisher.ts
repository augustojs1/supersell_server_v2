import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../../../enum';
import { EmailOrderStatusChangeDto } from '../dto';
import { IEmailEventsPublisher } from '../iemail-events-publisher.interface';

@Injectable()
export class EmailEventsRabbitMqPublisher implements IEmailEventsPublisher {
  private readonly logger = new Logger(EmailEventsRabbitMqPublisher.name);

  constructor(
    @Inject('EMAIL_MICROSERVICE')
    private readonly messagingClient: ClientProxy,
  ) {}

  public emitEmailPasswordResetMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_PASSWORD_RESET, payload);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_PASSWORD_RESET}`,
    );
  }

  public emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): void {
    this.messagingClient.emit(
      MessagingTopics.EMAIL_ORDER_STATUS_CHANGE,
      payload,
    );
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_STATUS_CHANGE}`,
    );
  }

  public emitEmailOrderCreatedChangeMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_ORDER_CREATED, payload);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_CREATED}`,
    );
  }

  public emitEmailOrderInvoiceMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_ORDER_INVOICE, payload);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_INVOICE}`,
    );
  }

  public emitEmailOrderReceiptMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_ORDER_CREATED, payload);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_CREATED}`,
    );
  }
}
