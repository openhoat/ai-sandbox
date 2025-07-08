import { join } from 'node:path'
import type { VectorStore } from '@langchain/core/vectorstores'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { baseDir } from '../../utils/base-dir'

const chunkSize = 100
const chunkOverlap = 0

const { VERBOSE } = process.env
const verbose = VERBOSE === 'true'

export const loadDirectory = async (
  dirname: string,
  vectorStore: VectorStore,
) => {
  const directoryPath = join(baseDir, 'data', 'rag', dirname)
  if (verbose) {
    console.log(`Loading directory ${directoryPath} with extensions .txt`)
  }
  const loader = new DirectoryLoader(directoryPath, {
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
