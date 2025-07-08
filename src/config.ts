import { z } from 'zod'
import type { ConfigCustom } from './utils/config-builder'

const schema = z.object({
  timeout: z.number().default(5000),
  modelProvider: z.enum(['openai', 'gemini', 'mistral', 'ollama']),
  model: z.string().optional(),
  googleApiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  mistralApiKey: z.string().optional(),
  ollamaBaseUrl: z.string().optional(),
})

export type Config = z.infer<typeof schema>

const custom: ConfigCustom<Config> = {}

export const configSpec = { schema, custom }
