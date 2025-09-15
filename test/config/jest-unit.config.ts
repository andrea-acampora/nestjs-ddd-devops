import { Config } from 'jest';

const unitConfig: Config = {
  rootDir: '../',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['./config/jest.setup.ts'],
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
};

export default unitConfig;
