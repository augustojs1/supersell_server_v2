import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../enum';
import { PaymentMessagePayload } from '../types/payment-message-payload.type';

@Injectable()
export class PaymentBrokerService {
  private readonly logger = new Logger(PaymentBrokerService.name);

  constructor(
    @Inject('EXTERNAL_SERVICE_MICROSERVICE')
    private readonly paymentMessagingClient: ClientProxy,
  ) {}

  public sendOrderPaymentMessage(payload: PaymentMessagePayload) {
    this.paymentMessagingClient.emit(MessagingTopics.ORDER_PAYMENT, payload);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.ORDER_PAYMENT}.`,
    );
  }
}
