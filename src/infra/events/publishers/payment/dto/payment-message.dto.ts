export class PaymentMessagePayload {
  order: {
    id: string;
    total_price: number;
  };
  method: string;
  paymentDetails: {
    card_number: string;
    card_holder: string;
    expiration_date: string;
    cvv: string;
  };
}
