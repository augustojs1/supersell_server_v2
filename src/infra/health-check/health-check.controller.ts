import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/health')
export class HealthCheckController {
  @ApiOperation({
    summary: 'Check for application health status.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
  })
  @Get('/')
  public getHealthCheck() {
    return {
      status: 'Ok!',
    };
  }
}
