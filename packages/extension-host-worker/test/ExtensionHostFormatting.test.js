import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostFormatting.reset()
})

test('executeFormattingProvider - error - result value is of type string', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: 'a' },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'javascript',
    format() {
      return `b`
    },
  })
  await expect(
    ExtensionHostFormatting.executeFormattingProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      `Failed to execute formatting provider: VError: invalid formatting result: formatting must be of type array but is b`
    )
  )
})

test('executeFormattingProvider - error - result value is of type object', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: 'a' },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'javascript',
    format() {
      return {}
    },
  })
  await expect(
    ExtensionHostFormatting.executeFormattingProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      `Failed to execute formatting provider: VError: invalid formatting result: formatting must be of type array but is object`
    )
  )
})

test('executeFormattingProvider', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: 'a' },
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
  expect(await ExtensionHostFormatting.executeFormattingProvider(1, 0)).toEqual(
    [{ endOffset: 1, inserted: 'b', startOffset: 0 }]
  )
})
