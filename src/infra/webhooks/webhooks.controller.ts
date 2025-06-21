import { OrderService } from '@/modules/order/order.service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBody,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify/types/request';

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

  @ApiOperation({
    summary: 'Stripe webhook route.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Successfully processed Stripe webhook request',
  })
  @Post('/stripe')
  @HttpCode(200)
  public async processStripeWebhook(
    @Req() req: FastifyRequest,
    @RawBody() rawBody: Buffer,
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === 'checkout.session.completed') {
      const session = body.data.object;

      const orderId = session.metadata?.orderId;
      const status = session.payment_status;

      if (status === 'paid') {
        await this.orderService.handleOrderPaymentSuccess(orderId);
      }
    }

    return {
      status: 'ok',
    };
  }
}
