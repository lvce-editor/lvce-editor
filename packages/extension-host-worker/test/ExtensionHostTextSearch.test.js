import * as ExtensionHostTextSearch from '../src/parts/ExtensionHostTextSearch/ExtensionHostTextSearch.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostTextSearch.reset()
})
// TODO test when provider has wrong type or delivers wrong result

// TODO should have better error message here
test('registerTabCompletionProvider - no argument provided', () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  expect(() =>
    ExtensionHostTextSearch.registerTextSearchProvider()
  ).toThrowError(
    new Error("Cannot read properties of undefined (reading 'scheme')")
  )
})

test('executeTextSearchProvider - no provider found', async () => {
  await expect(
    ExtensionHostTextSearch.executeTextSearchProvider('xyz', 'abc')
  ).rejects.toThrowError(new Error('no text search provider for xyz found'))
})
