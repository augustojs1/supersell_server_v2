import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class ImageFieldsValidatorInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const MAX_FILE_SIZE = 3_000_000; // 3 Mb

    const request = context.switchToHttp().getRequest();

    if (request?.files) {
      for (const field of this.fields) {
        request.files[field].forEach((file, index) => {
          if (file.size > MAX_FILE_SIZE) {
            throw new UnprocessableEntityException(
              `File at position [${index}] in ${field} field does not pass MAX_FILE_SIZE validation.`,
            );
          }

          const mimetype = file.mimetype.split('/');

          if (mimetype[0] !== 'image') {
            throw new UnprocessableEntityException(
              `File at position [${index}] in ${field} field is not an image.`,
            );
          }
        });
      }

      return next.handle();
    }

    return next.handle();
  }
}
