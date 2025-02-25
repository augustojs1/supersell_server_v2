import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../enum';

@Injectable()
export class EmailBrokerService {
  constructor(
    @Inject('EXTERNAL_SERVICE_MICROSERVICE')
    private readonly messagingClient: ClientProxy,
  ) {}

  public emitEmailPasswordResetMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_PASSWORD_RESET, payload);
  }

  public emitEmailOrderStatusChangeMessage(payload: any): void {
    this.messagingClient.emit(
      MessagingTopics.EMAIL_ORDER_STATUS_CHANGE,
      payload,
    );
  }

  public emitEmailOrderCreatedChangeMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_ORDER_CREATED, payload);
  }

  public emitEmailOrderInvoiceMessage(payload: any): void {
    this.messagingClient.emit(MessagingTopics.EMAIL_ORDER_INVOICE, payload);
  }
}
