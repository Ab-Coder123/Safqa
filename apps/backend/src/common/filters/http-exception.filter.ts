import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiErrorResponse } from '@safqa/types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'An unexpected server error occurred';
    let error = 'Internal Server Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const respObj = exceptionResponse as Record<string, any>;
      message = respObj.message || message;
      error = respObj.error || error;
    }

    const errorPayload: IApiErrorResponse = {
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      error,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorPayload);
  }
}
