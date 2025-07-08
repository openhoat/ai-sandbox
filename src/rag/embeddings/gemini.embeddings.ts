import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

const defaultGeminiEmbeddingsModel = 'models/gemini-embedding-exp-03-07'

export const createGeminiEmbeddings = (config: {
  googleApiKey: string
  embeddingsModel?: string
}) => {
  const {
    googleApiKey: apiKey,
    embeddingsModel: model = defaultGeminiEmbeddingsModel,
  } = config
  return new GoogleGenerativeAIEmbeddings({
    apiKey,
    model,
  })
}
