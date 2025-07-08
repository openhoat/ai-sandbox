import type { Config as JestConfig } from 'jest'
import { loadEnv } from './src/utils/env.helper'

loadEnv('test')

const config: JestConfig = {
  rootDir: '.',
  roots: ['<rootDir>/src'],
  passWithNoTests: true,
  preset: 'ts-jest',
  silent: process.env.VERBOSE !== 'true',
  testMatch: ['<rootDir>/src/test/**/*.test.ts'],
  testTimeout: 20000,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
}

export default config
