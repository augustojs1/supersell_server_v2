import { OrderService } from '@/modules/order/order.service';
import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('webhooks')
export class WebhooksController {
  private readonly stripeClient: Stripe;

  constructor(
    private readonly configService: ConfigService,
    public readonly orderService: OrderService,
  ) {
    this.stripeClient = new Stripe(
      this.configService.get<string>('stripe.secret_key'),
      {
        apiVersion: '2025-05-28.basil',
      },
    );
  }

  @Post('/stripe')
  @HttpCode(200)
  public async processStripeWebhook(@Headers() headers, @Body() body: any) {
    const metadata = body['data'].object.metadata;
    const paymentStatus = body['data'].object.payment_status;

    if (metadata?.orderId && paymentStatus === 'paid') {
      await this.orderService.handleOrderPaymentSuccess(metadata.orderId);
    }

    return {
      status: 'ok',
    };

    // TODO: Verify Stripe Webhook Signature
    // try {
    //   event = this.stripeClient.webhooks.constructEvent(
    //     rawBody,
    //     headers['stripe-signature'],
    //     process.env.STRIPE_WEBHOOK_KEY,
    //   );
    // } catch (err) {
    //   console.error('Erro ao verificar webhook Stripe:', err.message);
    // }
  }
}
