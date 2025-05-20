import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../../../enum';
import { PaymentMessagePayload } from '../dto';

@Injectable()
export class PaymentEventsRabbitMqPublisher {
  private readonly logger = new Logger(PaymentEventsRabbitMqPublisher.name);

  constructor(
    @Inject('PAYMENT_MICROSERVICE')
    private readonly paymentMessagingClient: ClientProxy,
  ) {}

  public sendOrderPaymentMessage(payload: PaymentMessagePayload) {
    this.paymentMessagingClient.emit(MessagingTopics.ORDER_PAYMENT, payload);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.ORDER_PAYMENT}.`,
    );
  }
}
