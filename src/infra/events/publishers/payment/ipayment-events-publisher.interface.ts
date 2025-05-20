import { PaymentMessagePayload } from './dto/';

export abstract class IPaymentEventsPublisher {
  abstract sendOrderPaymentMessage(payload: PaymentMessagePayload): void;
}
