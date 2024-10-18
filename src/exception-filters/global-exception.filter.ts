import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException ? exception.message : 'Lỗi server';

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(exception.response?.message)
        ? exception.response?.message[0]
        : message,
      error:
        this.configService.get('NODE_ENV') !== 'production'
          ? {
              response: exception.response,
              stack: exception.stack,
            }
          : 'Something went wrong!',
    });
  }
}
