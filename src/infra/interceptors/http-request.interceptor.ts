import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements NestInterceptor {
  private logger = new Logger(HttpRequestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.logger.log(`${request.method} -> ${request.url}`);

    return next.handle();
  }
}
