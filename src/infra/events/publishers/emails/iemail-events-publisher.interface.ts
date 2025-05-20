import { EmailOrderStatusChangeDto } from './dto';

export abstract class IEmailEventsPublisher {
  abstract emitEmailPasswordResetMessage(payload: any): void;
  abstract emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): void;
  abstract emitEmailOrderCreatedChangeMessage(payload: any): void;
  abstract emitEmailOrderInvoiceMessage(payload: any): void;
  abstract emitEmailOrderReceiptMessage(payload: any): void;
}
