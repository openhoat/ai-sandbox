import { OpenAIEmbeddings } from '@langchain/openai'

const defaultOpenAiEmbeddingsModel = 'text-embedding-3-large'

export const createOpenAiEmbeddings = (config: {
  openaiApiKey: string
  embeddingsModel?: string
}) => {
  const {
    openaiApiKey: apiKey,
    embeddingsModel: model = defaultOpenAiEmbeddingsModel,
  } = config
  return new OpenAIEmbeddings({
    apiKey,
    model,
  })
}
