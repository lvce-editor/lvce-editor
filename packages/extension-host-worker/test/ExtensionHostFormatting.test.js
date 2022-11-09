import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostFormatting.reset()
})

test('executeFormattingProvider', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: 'a' },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'javascript',
    format() {
      return `b`
    },
  })
  expect(await ExtensionHostFormatting.executeFormattingProvider(1, 0)).toBe(
    `b`
  )
})
