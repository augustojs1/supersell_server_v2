import { PaymentMethods } from '@/modules/order/enums';

export class OrderPaymentPayload {
  order_id: string;
  amount: number;
  method: PaymentMethods;
  paymentDetails: {
    card_number: string;
    card_holder: string;
    expiration_date: string;
    cvv: string;
  };
}
