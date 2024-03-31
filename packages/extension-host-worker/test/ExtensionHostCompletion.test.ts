import { expect, jest, test } from '@jest/globals'
import * as ExtensionHostCompletion from '../src/parts/ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

test('registerCompletionProvider - no argument provided', () => {
  // @ts-ignore
  expect(() => ExtensionHostCompletion.registerCompletionProvider()).toThrow(new Error("Cannot read properties of undefined (reading 'languageId')"))
})

test('executeCompletionProvider - when completion provider has no result', async () => {
  const textDocument = {
    id: 1,
    path: '/tmp/some-file.txt',
    languageId: 'unknown',
    content: 'sample text',
  }
  TextDocument.setFiles([textDocument])
  const completionProvider = {
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions: jest.fn((textDocument, offset) => {
      return []
    }),
  }
  ExtensionHostCompletion.registerCompletionProvider(completionProvider)
  // @ts-ignore
  expect(await ExtensionHostCompletion.executeCompletionProvider(1, 1)).toEqual([])
  expect(completionProvider.provideCompletions).toHaveBeenCalledTimes(1)
  expect(completionProvider.provideCompletions).toHaveBeenCalledWith(textDocument, 1)
})

test('execute - when tab completion provider has wrong shape', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    abc() {},
  })
  // @ts-ignore
  await expect(ExtensionHostCompletion.executeCompletionProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute completion provider: VError: completionProvider.provideCompletions is not a function'),
  )
})

test('executeCompletionProvider - when completion provider has normal result', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions(textDocument, offset) {
      return [
        {
          label: 'Option A',
          snippet: 'Option A',
        },
        {
          label: 'Option B',
          snippet: 'Option B',
        },
      ]
    },
  })
  // @ts-ignore
  expect(await ExtensionHostCompletion.executeCompletionProvider(1, 1)).toEqual([
    {
      label: 'Option A',
      snippet: 'Option A',
    },
    {
      label: 'Option B',
      snippet: 'Option B',
    },
  ])
})

test('executeCompletionProvider - completion provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions(textDocument, offset) {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostCompletion.executeCompletionProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute completion provider: TypeError: x is not a function'),
  )
})

test('executeCompletionProvider - completion provider throws null error', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions(textDocument, offset) {
      throw null
    },
  })
  // @ts-ignore
  await expect(ExtensionHostCompletion.executeCompletionProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute completion provider: NonError: null'),
  )
})

test('executeCompletionProvider - invalid return value - array with undefined value', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions(textDocument, offset) {
      return [undefined]
    },
  })
  // @ts-ignore
  await expect(ExtensionHostCompletion.executeCompletionProvider(1, 1)).rejects.toThrow(
    new Error(
      'Failed to execute completion provider: VError: invalid completion result: expected completion item to be of type object but was of type undefined',
    ),
  )
})

test('executeCompletionProvider - invalid return value - number', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions(textDocument, offset) {
      return 42
    },
  })
  // @ts-ignore
  await expect(ExtensionHostCompletion.executeCompletionProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute completion provider: VError: invalid completion result: completion must be of type array but is 42'),
  )
})

test('executeCompletionProvider - invalid return value - undefined', async () => {
  TextDocument.setFiles([
    {
      path: '/tmp/some-file.txt',
      id: 1,
      languageId: 'unknown',
      content: 'sample text',
    },
  ])
  ExtensionHostCompletion.registerCompletionProvider({
    languageId: 'unknown',
    // @ts-ignore
    provideCompletions(textDocument, offset) {
      return undefined
    },
  })
  // @ts-ignore
  await expect(ExtensionHostCompletion.executeCompletionProvider(1, 1)).rejects.toThrow(
    new Error('Failed to execute completion provider: VError: invalid completion result: completion must be of type array but is undefined'),
  )
})
