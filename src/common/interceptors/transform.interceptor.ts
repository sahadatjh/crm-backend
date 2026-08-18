import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // Handle specific format structure if returned directly from service
        const meta = data?.meta ? data.meta : undefined;
        let responseData = data;
        let message = 'Operation successful';

        if (data && typeof data === 'object') {
          if ('data' in data) {
            responseData = data.data;
          }
          if ('message' in data) {
            message = data.message;
          }
        }

        // Avoid double wrapping if it's already wrapped (though it shouldn't be)
        if (data?.success !== undefined && data?.statusCode !== undefined) {
          return data;
        }

        return {
          success: true,
          statusCode,
          message,
          data: responseData || {},
          ...(meta && { meta }),
        };
      }),
    );
  }
}
