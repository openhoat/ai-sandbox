import { MistralAIEmbeddings } from '@langchain/mistralai'

const defaultMistralEmbeddingsModel = 'mistral-embed'

export const createMistralEmbeddings = (config: {
  mistralApiKey: string
  embeddingsModel?: string
}) => {
  const {
    mistralApiKey: apiKey,
    embeddingsModel: model = defaultMistralEmbeddingsModel,
  } = config
  return new MistralAIEmbeddings({
    apiKey,
    model,
  })
}
