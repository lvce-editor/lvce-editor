import { jest } from '@jest/globals'
import * as ExtensionHostClosingTag from '../src/parts/ExtensionHostClosingTag/ExtensionHostClosingTag.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('registerClosingTagProvider - no argument provided', () => {
  expect(() => ExtensionHostClosingTag.registerClosingTagProvider()).toThrow(new Error("Cannot read properties of undefined (reading 'languageId')"))
})

test('executeClosingTagProvider - when closing tag provider has no result', async () => {
  const textDocument = {
    id: 1,
    path: '/tmp/some-file.txt',
    languageId: 'unknown',
    content: 'sample text',
  }
  TextDocument.setFiles([textDocument])
  const closingTagProvider = {
    languageId: 'unknown',
    // @ts-ignore
    provideClosingTag: jest.fn((textDocument, offset) => {
      return undefined
    }),
  }
  ExtensionHostClosingTag.registerClosingTagProvider(closingTagProvider)
  // @ts-ignore
  expect(await ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).toEqual(undefined)
  expect(closingTagProvider.provideClosingTag).toHaveBeenCalledTimes(1)
  expect(closingTagProvider.provideClosingTag).toHaveBeenCalledWith(textDocument, 1)
})

test('execute - when tab closing tag provider has wrong shape', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostClosingTag.registerClosingTagProvider({
    languageId: 'unknown',
    abc() {},
  })
  // @ts-ignore
  await expect(ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute closing tag provider: VError: closingTagProvider.provideClosingTag is not a function'),
  )
})

test('executeClosingTagProvider - when closing tag provider has normal result', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostClosingTag.registerClosingTagProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideClosingTag(textDocument, offset) {
      return {
        inserted: '</div>',
      }
    },
  })
  // @ts-ignore
  expect(await ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).toEqual({
    inserted: '</div>',
  })
})

test('executeClosingTagProvider - closing tag provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostClosingTag.registerClosingTagProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideClosingTag(textDocument, offset) {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute closing tag provider: TypeError: x is not a function'),
  )
})

test('executeClosingTagProvider - closing tag provider throws null error', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostClosingTag.registerClosingTagProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideClosingTag(textDocument, offset) {
      throw null
    },
  })
  // @ts-ignore
  await expect(ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute closing tag provider: NonError: null'),
  )
})

test('executeClosingTagProvider - invalid return value - array with undefined value', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostClosingTag.registerClosingTagProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideClosingTag(textDocument, offset) {
      return [undefined]
    },
  })
  // @ts-ignore
  await expect(ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute closing tag provider: VError: invalid closing tag result: closingTag must be of type object but is array'),
  )
})

test('executeClosingTagProvider - invalid return value - number', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostClosingTag.registerClosingTagProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideClosingTag(textDocument, offset) {
      return 42
    },
  })
  // @ts-ignore
  await expect(ExtensionHostClosingTag.executeClosingTagProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute closing tag provider: VError: invalid closing tag result: closingTag must be of type object but is 42'),
  )
})
