import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const startTime = Date.now();

        this.logger.info({
            message: 'Incoming Request',
            method,
            url,
            body: JSON.stringify(body),
            timestamp: new Date().toISOString(),
        });

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - startTime; // Log request duration
                this.logger.info({
                    message: 'Request Processed',
                    method,
                    url,
                    duration: `${duration}ms`,
                    timestamp: new Date().toISOString(),
                });
            }),
        );
    }
}
