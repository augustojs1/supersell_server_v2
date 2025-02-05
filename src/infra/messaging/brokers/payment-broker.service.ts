import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MessagingTopics } from '../enum';

@Injectable()
export class PaymentBrokerService {
  constructor(
    @Inject('CORE') private readonly paymentMessagingClient: ClientProxy,
  ) {}

  public sendOrderPaymentMessage() {
    const payload = [
      {
        totalValue: 100.0,
        items: [
          {
            product_id: '1312',
            price: 70.0,
          },
          {
            product_id: '31424',
            price: 30.0,
          },
        ],
      },
    ];

    this.paymentMessagingClient.emit(MessagingTopics.ORDER_PAYMENT, payload);
  }
}
