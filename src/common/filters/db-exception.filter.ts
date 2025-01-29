import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch(QueryFailedError, EntityNotFoundError)
export class DbExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Database error occurred';

        if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Record not found.';
        } else if (exception instanceof QueryFailedError) {
            const errorCode = (exception as any).code;

            switch (errorCode) {
                case 'ER_DUP_ENTRY':
                    status = HttpStatus.CONFLICT;
                    message = 'Duplicate entry. This record already exists.';
                    break;
                case 'ER_NO_REFERENCED_ROW_2':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Foreign key constraint failed. Related record not found.';
                    break;
                case 'ER_BAD_FIELD_ERROR':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Invalid field name in the query.';
                    break;
                case 'ER_DATA_TOO_LONG':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Input data is too long for the field.';
                    break;
                case 'ER_PARSE_ERROR':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Syntax error in SQL query.';
                    break;
                default:
                    message = exception.message;
                    break;
            }
        }

        response.status(status).json({
            status: false,
            message,
            data: null,
        });
    }
}
