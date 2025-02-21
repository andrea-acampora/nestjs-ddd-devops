import { fromNullable, getOrThrowWith } from 'effect/Option';
import { ConfigService } from '@nestjs/config';

export const getConfigValue = <T>(
  configService: ConfigService,
  key: string,
): T => {
  console.log('AAA');
  return getOrThrowWith<T>(
    fromNullable(configService.get<T>(key)),
    () => new Error(`Missing ${key}`),
  );
};
