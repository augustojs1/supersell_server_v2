import { ulid } from 'ulid';
import { LoggerFactory, JsonLogger } from 'json-logger-service';

import { OrderPaymentDto } from '@/modules/order/dto';
import { IPaymentGateway } from '@/infra/payment-gateway/ipayment-gateway.interface';
import { PaymentGatewayResponse } from '@/infra/payment-gateway/models/payment-gateway-succes.type';

export class MockPaymentGatewayService implements IPaymentGateway {
  private readonly logger: JsonLogger = LoggerFactory.createLogger(
    MockPaymentGatewayService.name,
  );

  public async process(data: OrderPaymentDto): Promise<PaymentGatewayResponse> {
    const result = true;

    if (!result) {
      this.logger.info(
        {
          body: data,
        },
        `Payment via Mock NOT APPROVED`,
      );

      return {
        code: null,
        success: false,
      };
    }

    this.logger.info(
      {
        body: data,
      },
      `Payment via Mock APPROVED`,
    );

    return {
      code: ulid(),
      success: true,
    };
  }
}
