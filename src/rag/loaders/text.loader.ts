import { join } from 'node:path'
import type { VectorStore } from '@langchain/core/vectorstores'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { baseDir } from '../../utils/base-dir'

const chunkSize = 100
const chunkOverlap = 0

export const loadTextDocument = async (
  filename: string,
  vectorStore: VectorStore,
) => {
  const loader = new TextLoader(join(baseDir, 'data', 'rag', filename))
  const docs = await loader.load()
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  })
  const chunks = await splitter.splitDocuments(docs)
  await vectorStore.addDocuments(chunks)
}
