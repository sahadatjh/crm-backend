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
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const method = request.method;

    // Extract resource name from URL (e.g. /api/v1/clients -> Client)
    const path = request.path || request.url.split('?')[0];
    const parts = path.split('/').filter(Boolean);
    const entityPart = parts[2] || 'Resource';
    
    let resourceName = entityPart.charAt(0).toUpperCase() + entityPart.slice(1);
    if (resourceName.endsWith('ies')) {
      resourceName = resourceName.slice(0, -3) + 'y';
    } else if (resourceName.endsWith('s') && resourceName.toLowerCase() !== 'settings') {
      resourceName = resourceName.slice(0, -1);
    }

    const defaultMessages: Record<string, string> = {
      GET: `${resourceName} retrieved successfully`,
      POST: `${resourceName} created successfully`,
      PATCH: `${resourceName} updated successfully`,
      PUT: `${resourceName} updated successfully`,
      DELETE: `${resourceName} deleted successfully`,
    };

    return next.handle().pipe(
      map((data) => {
        // Handle specific format structure if returned directly from service
        const meta = data?.meta ? data.meta : undefined;
        let responseData = data;
        let message = defaultMessages[method] || 'Operation successful';

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
