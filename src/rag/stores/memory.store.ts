import type { Embeddings } from '@langchain/core/embeddings'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

export const createMemoryStore = async (embeddings: Embeddings) =>
  new MemoryVectorStore(embeddings)
