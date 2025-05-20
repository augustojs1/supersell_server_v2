import { Injectable, Logger } from '@nestjs/common';

import { MessagingTopics } from '../../../enum';
import { PaymentMessagePayload } from '../dto';
import { IPaymentEventsPublisher } from '../ipayment-events-publisher.interface';

@Injectable()
export class PaymentEventsSnsPublisher implements IPaymentEventsPublisher {
  private readonly logger = new Logger(PaymentEventsSnsPublisher.name);

  constructor() {}

  public sendOrderPaymentMessage(payload: PaymentMessagePayload) {
    this.logger.log(
      `Publish message on topic ${MessagingTopics.ORDER_PAYMENT}.`,
    );
  }
}
