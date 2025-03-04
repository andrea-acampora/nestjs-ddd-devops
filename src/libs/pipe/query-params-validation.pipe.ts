import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class QueryParamsValidationPipe implements PipeTransform {
  async transform(
    params: Record<string, string>,
    { metatype }: ArgumentMetadata,
  ) {
    if (!metatype) return params;
    const dto = plainToInstance(metatype, params);
    const errors: ValidationError[] = await validate(dto, {
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    if (errors.length > 0) {
      const message = this.buildErrorMessages(errors);
      throw new BadRequestException('Invalid query parameters: ' + message);
    }
    return dto;
  }

  private buildErrorMessages(
    errors: ValidationError[],
    parentPath: string = '',
  ): string {
    return errors
      .map((err) => {
        const propertyPath = parentPath
          ? `${parentPath}.${err.property}`
          : err.property;
        if (err.children && err.children.length > 0) {
          return this.buildErrorMessages(err.children, propertyPath);
        }
        const constraints = Object.values(err.constraints || {}).join(', ');
        return `${propertyPath}: ${constraints}`;
      })
      .join('; ');
  }
}
