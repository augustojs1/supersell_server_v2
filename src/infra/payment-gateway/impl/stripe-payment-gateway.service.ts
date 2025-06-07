import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { LoggerFactory, JsonLogger } from 'json-logger-service';

import { IPaymentGateway } from '@/infra/payment-gateway/ipayment-gateway.interface';
import { OrderPaymentPayload } from '../models';

@Injectable()
export class StripePaymentGatewayService implements IPaymentGateway {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(
    StripePaymentGatewayService.name,
  );
  private readonly stripeClient: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(
      this.configService.get<string>('stripe.secret_key'),
      {
        apiVersion: '2025-05-28.basil',
      },
    );

    this.logger.info({ success: true }, 'Succesfully init Stripe Client');
  }

  public async process(data: OrderPaymentPayload): Promise<string> {
    this.logger.info(data, 'Stripe received payment to process');

    try {
      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Order #${data.order_id}`,
              },
              unit_amount: Number(data.amount) * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://supersell.augustojsdev.com.br/payment/success?orderId=${data.order_id}`,
        cancel_url: `https://supersell.augustojsdev.com.br/payment/failed?orderId=${data.order_id}`,
        metadata: {
          orderId: data.order_id,
        },
      });

      this.logger.info(data, 'Stripe successfully processed payment');

      return session.url;
    } catch (error) {
      this.logger.info(data, 'Stripe error processing a payment');
      throw error;
    }
  }
}
