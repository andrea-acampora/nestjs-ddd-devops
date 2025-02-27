import { Config } from 'jest';
import baseConfig from './jest.config.base';

const e2eConfig: Config = {
  ...baseConfig,
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
