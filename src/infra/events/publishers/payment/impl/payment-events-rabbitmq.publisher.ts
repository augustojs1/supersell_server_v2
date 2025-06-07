import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../../../enum';
import { IPaymentEventsPublisher } from '../ipayment-events-publisher.interface';

@Injectable()
export class PaymentEventsRabbitMqPublisher implements IPaymentEventsPublisher {
  private readonly logger = new Logger(PaymentEventsRabbitMqPublisher.name);

  constructor(
    @Inject('PAYMENT_MICROSERVICE')
    private readonly paymentMessagingClient: ClientProxy,
  ) {}

  public sendOrderPaymentMessage(orderId: string) {
    this.paymentMessagingClient.emit(MessagingTopics.ORDER_PAYMENT, orderId);
    this.logger.log(
      `Publish message on topic ${MessagingTopics.ORDER_PAYMENT}.`,
    );
  }
}
