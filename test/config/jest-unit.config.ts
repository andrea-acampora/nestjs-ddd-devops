import { Config } from 'jest';
import baseConfig from './jest.config.base';

const unitConfig: Config = {
  ...baseConfig,
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
};

export default unitConfig;
