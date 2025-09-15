import { Config } from 'jest';

const e2eConfig: Config = {
  rootDir: '../',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)/'],
  setupFiles: ['./config/jest.setup.ts'],
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
