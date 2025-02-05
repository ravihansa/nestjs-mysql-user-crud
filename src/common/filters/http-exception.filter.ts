import { Response } from 'express';
import { Logger } from 'winston';
import { logError } from '../utils/logger.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            message = (errorResponse as any).message || message;
        }

        // Log the error
        logError(this.logger, request, exception, status, message);

        response.status(status).json({
            status: false,
            message,
            data: null,
        });
    }
}
