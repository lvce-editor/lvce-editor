import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostFormatting.reset()
})

test('executeFormattingProvider - error - result value is of type string', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: 'a',
    },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'javascript',
    format() {
      return 'b'
    },
  })
  // @ts-ignore
  await expect(ExtensionHostFormatting.executeFormattingProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute formatting provider: VError: invalid formatting result: formatting must be of type array but is "b"'),
  )
})

test('executeFormattingProvider - error - result value is of type object', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: 'a',
    },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'javascript',
    format() {
      return {}
    },
  })
  // @ts-ignore
  await expect(ExtensionHostFormatting.executeFormattingProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute formatting provider: VError: invalid formatting result: formatting must be of type array but is object'),
  )
})

test('executeFormattingProvider', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: 'a',
    },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'javascript',
    format() {
      return [
        {
          startOffset: 0,
          endOffset: 1,
          inserted: 'b',
        },
      ]
    },
  })
  // @ts-ignore
  expect(await ExtensionHostFormatting.executeFormattingProvider(1, 0)).toEqual([{ endOffset: 1, inserted: 'b', startOffset: 0 }])
})
