import { Logger } from 'winston';
import { Request } from 'express';

/**
 * Logs an error using Winston
 * @param logger Winston logger instance
 * @param request Express request object
 * @param exception The error or exception object
 * @param status HTTP status code
 * @param customMessage Custom message for logging
 */
export function logError(
    logger: Logger,
    request: Request,
    exception: any,
    status: number,
    customMessage: string
) {
    logger.error({
        message: customMessage,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error: exception.message || exception,
    });
};

