import { describe, expect, test } from '@jest/globals'
import z from 'zod'
import {
  buildConfig,
  type ConfigCustom,
  type EnvProvider,
} from '../../utils/config-builder'

describe('utils', () => {
  describe('config builder', () => {
    describe('buildConfig', () => {
      const schema = z.object({
        foo: z.string().default('bar'),
        logLevel: z.enum(['debug', 'info', 'error']).default('info'),
        hello: z.string(),
        value: z.number(),
      })
      const custom: ConfigCustom<z.Infer<typeof schema>> = {
        value: {
          transform: z.string().transform(Number),
        },
      }
      const configSpec = { schema, custom }
      type Testcase = {
        env: EnvProvider
        expectedConfig: Record<string, unknown>
      }
      const testcases: Testcase[] = [
        {
          env: { FOO: 'barzzzz', HELLO: 'world', VALUE: '123' },
          expectedConfig: {
            foo: 'barzzzz',
            logLevel: 'info',
            hello: 'world',
            value: 123,
          },
        },
        {
          env: { HELLO: 'world', VALUE: '123' },
          expectedConfig: {
            foo: 'bar',
            logLevel: 'info',
            hello: 'world',
            value: 123,
          },
        },
      ]
      test.each(testcases)(
        'should return a valid config given schema and environment $env',
        ({ env, expectedConfig }) => {
          // When
          const config = buildConfig(configSpec, env)
          // Then
          expect(config).toStrictEqual(expectedConfig)
        },
      )
    })
  })
})
