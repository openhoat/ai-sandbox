import * as v from 'valibot'
import type { ConfigCustom } from './utils/config-builder'

const schema = v.object({
  timeout: v.optional(v.number(), 5000),
  modelProvider: v.picklist(['openai', 'gemini', 'mistral', 'ollama']),
  model: v.optional(v.string()),
  googleApiKey: v.optional(v.string()),
  openaiApiKey: v.optional(v.string()),
  mistralApiKey: v.optional(v.string()),
  ollamaBaseUrl: v.optional(v.string()),
})

export type Config = v.InferOutput<typeof schema>

const custom: ConfigCustom<Config> = {}

export const configSpec = { schema, custom }
