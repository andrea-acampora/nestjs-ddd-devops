import type { Config } from 'jest';

const baseConfig: Config = {
  rootDir: '../',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['./config/jest.setup.ts'],
};

export default baseConfig;
