import * as v from 'valibot'
import { loadEnv } from './env.helper'
import { toPascalCase } from './string.helper'

export type ConfigCustomItem = {
  transform?: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  envVarName?: string
}

export type ConfigCustom<T> = Partial<Record<keyof T, ConfigCustomItem>>

export type ConfigSpec<
  T extends v.ObjectEntries,
  M extends v.ErrorMessage<v.ObjectIssue> | undefined,
> = {
  schema: v.ObjectSchema<T, M>
  custom?: ConfigCustom<T>
}

export const buildConfig = <
  T extends v.ObjectEntries,
  M extends v.ErrorMessage<v.ObjectIssue> | undefined,
>({
  schema,
  custom,
}: ConfigSpec<T, M>) => {
  loadEnv(process.env.ENVIRONMENT)
  const { VERBOSE } = process.env
  const verbose = VERBOSE === 'true'
  const configShemaEntries = Object.keys(schema.entries)
  const config = v.parse(
    schema,
    configShemaEntries.reduce(
      (acc, name: string) => {
        const spec = custom?.[name]
        const envVarName = spec?.envVarName ?? toPascalCase(name)
        const envVarValue = process.env[envVarName]
        if (envVarValue === undefined) {
          return acc
        }
        const transform = spec?.transform ?? schema.entries[name]
        acc[name] = v.parse(transform, envVarValue)
        return acc
      },
      {} as Record<string, unknown>,
    ),
  )
  if (verbose) {
    console.debug('Loaded config:', config)
  }
  return config
}
