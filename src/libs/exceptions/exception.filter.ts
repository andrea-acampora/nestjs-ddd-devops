import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const httpHost = host.switchToHttp();
    const exceptionResponse = exception.getResponse();
    const responseMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse['message'] || exception.message;
    if (host.getType().toString() === 'graphql') {
      throw new GraphQLError(responseMessage, {
        extensions: {
          code: exception.getStatus(),
          http: {
            status: exception.getStatus(),
          },
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      const response = httpHost.getResponse();
      const status = exception.getStatus();
      const request = httpHost.getRequest();
      response.code(status).send({
        statusCode: status,
        message: responseMessage,
        timestamp: new Date().toISOString(),
        path: request?.url || 'unknown',
      });
    }
  }
}
