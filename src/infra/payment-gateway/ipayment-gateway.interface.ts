import { OrderPaymentPayload } from '@/infra/payment-gateway/models';
import { PaymentGatewayResponse } from './models/payment-gateway-succes.type';

export abstract class IPaymentGateway {
  abstract process(data: OrderPaymentPayload): Promise<any>;
}
