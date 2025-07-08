import { createGeminiEmbeddings } from './gemini.embeddings'
import { createMistralEmbeddings } from './mistral.embeddings'
import { createOpenAiEmbeddings } from './openai.embeddings'

export type EmbeddingsModelProvider = 'gemini' | 'openai' | 'mistral' | 'ollama'

export type EmbeddingsConfig = {
  modelProvider: EmbeddingsModelProvider
  embeddingsModel?: string
  googleApiKey?: string
  mistralApiKey?: string
  openaiApiKey?: string
}

export const createEmbeddings = (config: EmbeddingsConfig) => {
  const { modelProvider, embeddingsModel } = config
  switch (modelProvider) {
    case 'gemini': {
      const { googleApiKey } = config
      if (!googleApiKey) {
        throw new Error('googleApiKey is required.')
      }
      return createGeminiEmbeddings({ googleApiKey, embeddingsModel })
    }
    case 'openai': {
      const { openaiApiKey } = config
      if (!openaiApiKey) {
        throw new Error('openaiApiKey is required.')
      }
      return createOpenAiEmbeddings({ openaiApiKey, embeddingsModel })
    }

    case 'mistral': {
      const { mistralApiKey } = config
      if (!mistralApiKey) {
        throw new Error('mistralApiKey is required.')
      }
      return createMistralEmbeddings({ mistralApiKey, embeddingsModel })
    }
    default:
      throw new Error(`Model type "${modelProvider} not supported.`)
  }
}
