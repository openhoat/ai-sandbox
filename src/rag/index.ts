import { type Config, configSpec } from '../config'
import { createModel } from '../models'
import { buildConfig } from '../utils/config-builder'
import { cleanPrompt } from '../utils/string.helper'
import { createEmbeddings } from './embeddings'
import { invokeGraph } from './graph'
import { loadDirectory } from './loaders/directory.loader'
import { createMemoryStore } from './stores/memory.store'

const template = cleanPrompt(`You are an assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the question.
      Never talk about the context.
      If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
      Question: {question} 
      Context: {context} 
      Answer:
    `)

export const run = async (
  question: string,
  dataDirname: string,
  config: Config,
) => {
  const model = createModel(config)
  const embeddings = createEmbeddings(config)
  const store = await createMemoryStore(embeddings)
  await loadDirectory(dataDirname, store)
  return invokeGraph(store, model, question, template)
}

if (require.main === module) {
  const question = 'What is a cat?'
  const config = buildConfig(configSpec)
  const [_, __, dataDirname = '1'] = process.argv
  void run(question, dataDirname, config).then((result) => {
    console.log(result.answer)
  })
}
