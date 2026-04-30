import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as { message?: string | string[] })?.message ??
          'Internal server error');

    const messageLabel = Array.isArray(message) ? message.join(', ') : message;

    const logContext = {
      path: request.url,
      method: request.method,
      statusCode: status,
      message: messageLabel,
    };

    if (exception instanceof HttpException) {
      if (status >= 500) {
        this.logger.error(
          {
            ...logContext,
            err: exception,
          },
          'HTTP error',
        );
      } else {
        this.logger.warn(logContext, 'HTTP client error');
      }
    } else {
      this.logger.error(
        {
          ...logContext,
          err:
            exception instanceof Error
              ? exception
              : new Error(JSON.stringify(exception)),
        },
        'Unhandled exception',
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
