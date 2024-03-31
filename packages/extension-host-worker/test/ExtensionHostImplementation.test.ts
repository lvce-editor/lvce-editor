import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostImplementation from '../src/parts/ExtensionHostImplementation/ExtensionHostImplementation.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostImplementation.reset()
})

test('executeImplementationProvider - no results', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    async provideImplementations() {
      return []
    },
  })
  // @ts-ignore
  expect(await ExtensionHostImplementation.executeImplementationProvider(1, 0)).toEqual([])
})

test('executeImplementationProvider - single result', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    async provideImplementations() {
      return [
        {
          uri: '/test/index.ts',
          lineText: '',
          startOffset: 0,
          endOffset: 0,
        },
      ]
    },
  })
  // @ts-ignore
  expect(await ExtensionHostImplementation.executeImplementationProvider(1, 0)).toEqual([
    {
      endOffset: 0,
      lineText: '',
      startOffset: 0,
      uri: '/test/index.ts',
    },
  ])
})

test('executeImplementationProvider - error - Implementation provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    provideImplementations() {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostImplementation.executeImplementationProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute implementation provider: TypeError: x is not a function'),
  )
})

test('executeImplementationProvider - error - ImplementationProvider has wrong shape', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    abc() {},
  })
  // @ts-ignore
  await expect(ExtensionHostImplementation.executeImplementationProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute implementation provider: VError: implementationProvider.provideImplementations is not a function'),
  )
})

test('executeImplementationProvider - error - no Implementation provider found', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  // @ts-ignore
  await expect(ExtensionHostImplementation.executeImplementationProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute implementation provider: No implementation provider found for javascript'),
  )
})
