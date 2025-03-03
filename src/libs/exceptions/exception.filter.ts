import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    if (exception instanceof BadRequestException) {
      response.code(400).send(exceptionResponse);
      return;
    }
    response.code(status).send({
      statusCode: status,
      message: exceptionResponse['message'] || exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
