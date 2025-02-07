import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../enum';
import { PaymentMessagePayload } from '../types/payment-message-payload.type';

@Injectable()
export class PaymentBrokerService {
  constructor(
    @Inject('EXTERNAL_SERVICE_MICROSERVICE')
    private readonly paymentMessagingClient: ClientProxy,
  ) {}

  public sendOrderPaymentMessage(payload: PaymentMessagePayload) {
    this.paymentMessagingClient.emit(MessagingTopics.ORDER_PAYMENT, payload);
  }
}
