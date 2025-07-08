import { beforeAll, describe, expect, test } from '@jest/globals'
import { type Config, configSpec } from '../../config'
import { run } from '../../rag'
import { buildConfig } from '../../utils/config-builder'

describe('integration tests', () => {
  let config: Config
  beforeAll(() => {
    config = buildConfig(configSpec)
  })
  describe('rag', () => {
    type Testcase = {
      dataDirname: string
      expectedResponseWords: string[]
    }
    const question = 'What is a cat?'
    const testcases: Testcase[] = [
      {
        expectedResponseWords: ['calm', 'silently', 'timeless'],
        dataDirname: '1',
      },
      {
        expectedResponseWords: ['moment', 'hungry', 'tired'],
        dataDirname: '2',
      },
      {
        expectedResponseWords: ['roommate', 'sleeps', 'respect', 'love'],
        dataDirname: '3',
      },
      {
        expectedResponseWords: ['moment', 'sun', 'stress'],
        dataDirname: '4',
      },
    ]
    test.each(testcases)(
      'should return an answer including expected words given a question, and dataDirname is "$dataDirname"',
      async ({ dataDirname, expectedResponseWords }) => {
        const { answer } = await run(question, dataDirname, config)
        expectedResponseWords.forEach((word) => {
          const re = new RegExp(`(\\W+|^)${word}(\\W+|$)`, 'i')
          expect(answer).toMatch(re)
        })
      },
    )
  })
})
