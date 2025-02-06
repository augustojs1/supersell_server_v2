import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      this.logger.error({
        type: 'HttpException',
        statusCode: exception.getStatus(),
        error: exception.getResponse(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });

      return response.status(exception.getStatus()).send({
        statusCode: exception.getStatus(),
        error: exception.getResponse(),
      });
    }

    if (exception?.code && exception?.sqlMessage) {
      this.logger.error({
        type: 'Database error',
        sqlMessage: exception.sqlMessage,
        timestamp: new Date().toISOString(),
        path: request.url,
      });

      return response.status(500).send({
        statusCode: 500,
        message: 'Unhandled Server exception.',
      });
    }

    this.logger.error({
      type: 'Unhandled Exception',
      statusCode: exception.getStatus(),
      error: exception.getResponse(),
    });

    return response.status(500).send({
      statusCode: 500,
      message: 'Unhandled exception.',
    });
  }
}
