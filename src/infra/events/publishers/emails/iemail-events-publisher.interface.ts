import { EmailOrderStatusChangeDto } from './dto';
import { PasswordResetEventPayload, OrderReceiptEventPayload } from './models';

export abstract class IEmailEventsPublisher {
  abstract emitEmailPasswordResetMessage(
    payload: PasswordResetEventPayload,
  ): Promise<void>;
  abstract emitEmailOrderStatusChangeMessage(
    payload: EmailOrderStatusChangeDto,
  ): void;
  abstract emitEmailOrderCreatedChangeMessage(payload: any): void;
  abstract emitEmailOrderInvoiceMessage(payload: any): void;
  abstract emitEmailOrderReceiptMessage(
    payload: OrderReceiptEventPayload,
  ): Promise<void>;
}
