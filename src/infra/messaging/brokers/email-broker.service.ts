import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../enum';
import { EmailOrderStatusChangeDto } from './dto';

@Injectable()
export class EmailBrokerService {
  private readonly logger = new Logger(EmailBrokerService.name);

  constructor(
    @Inject('EXTERNAL_SERVICE_MICROSERVICE')
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
