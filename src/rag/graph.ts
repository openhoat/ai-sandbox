import type { Document } from '@langchain/core/documents'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import type { VectorStore } from '@langchain/core/vectorstores'
import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { pull } from 'langchain/hub'

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
})

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
})

export const createRetriever =
  (vectorStore: VectorStore) =>
  async (state: typeof InputStateAnnotation.State) => {
    const retrievedDocs = await vectorStore.similaritySearch(state.question)
    return { context: retrievedDocs }
  }

export const createGenerator =
  (chatModel: BaseChatModel, promptTemplate: ChatPromptTemplate) =>
  async (state: typeof StateAnnotation.State) => {
    const mergedDocumentPageContents = state.context
      .map((doc) => doc.pageContent)
      .join('\n')
    const prompt = await promptTemplate.invoke({
      question: state.question,
      context: mergedDocumentPageContents,
    })
    const response = await chatModel.invoke(prompt)
    return { answer: response.content }
  }

export const invokeGraph = async (
  vectorStore: VectorStore,
  chatModel: BaseChatModel,
  question: string,
  template?: string,
) => {
  const promptTemplate = template
    ? ChatPromptTemplate.fromMessages(['user', template])
    : await pull<ChatPromptTemplate>('rlm/rag-prompt')
  const retrieve = createRetriever(vectorStore)
  const generate = createGenerator(chatModel, promptTemplate)
  const graph = new StateGraph(StateAnnotation)
    .addNode('retrieve', retrieve)
    .addNode('generate', generate)
    .addEdge(START, 'retrieve')
    .addEdge('retrieve', 'generate')
    .addEdge('generate', END)
    .compile()
  const inputs = { question }
  return graph.invoke(inputs)
}
