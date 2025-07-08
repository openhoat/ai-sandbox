import { join } from 'node:path'
import type { VectorStore } from '@langchain/core/vectorstores'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { baseDir } from '../../utils/base-dir'

const chunkSize = 100
const chunkOverlap = 0

export const loadDirectory = async (
  dirname: string,
  vectorStore: VectorStore,
) => {
  const loader = new DirectoryLoader(join(baseDir, 'data', 'rag', dirname), {
    '.txt': (path) => new TextLoader(path),
  })
  const docs = await loader.load()
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  })
  const chunks = await splitter.splitDocuments(docs)
  await vectorStore.addDocuments(chunks)
}
