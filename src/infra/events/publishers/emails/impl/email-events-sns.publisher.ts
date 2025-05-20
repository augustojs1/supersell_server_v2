import { Logger } from '@nestjs/common';

import { MessagingTopics } from '@/infra/events/enum';
import { IEmailEventsPublisher } from '../iemail-events-publisher.interface';
import { EmailOrderStatusChangeDto } from '../dto';

export class EmailEventsSnsPublisher implements IEmailEventsPublisher {
  private readonly logger: Logger = new Logger(EmailEventsSnsPublisher.name);

  constructor() {}

  public emitEmailPasswordResetMessage(payload: any): void {
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_PASSWORD_RESET}`,
    );
  }

  public emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): void {
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_STATUS_CHANGE}`,
    );
  }

  public emitEmailOrderCreatedChangeMessage(payload: any): void {
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_CREATED}`,
    );
  }

  public emitEmailOrderInvoiceMessage(payload: any): void {
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_INVOICE}`,
    );
  }

  public emitEmailOrderReceiptMessage(payload: any): void {
    this.logger.log(
      `Publish message on topic ${MessagingTopics.EMAIL_ORDER_CREATED}`,
    );
  }
}
