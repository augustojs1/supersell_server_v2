import { Controller, Get } from '@nestjs/common';

@Controller('/health')
export class HealthCheckController {
  @Get('/')
  public getHealthCheck() {
    return {
      status: 'Ok!',
    };
  }
}
