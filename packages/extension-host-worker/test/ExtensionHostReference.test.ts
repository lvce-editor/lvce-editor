import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostReference from '../src/parts/ExtensionHostReference/ExtensionHostReference.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostReference.reset()
})

test('executeReferenceProvider - no results', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    async provideReferences() {
      return []
    },
  })
  // @ts-ignore
  expect(await ExtensionHostReference.executeReferenceProvider(1, 0)).toEqual([])
})

test('executeReferenceProvider - single result', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    async provideReferences() {
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
  expect(await ExtensionHostReference.executeReferenceProvider(1, 0)).toEqual([
    {
      endOffset: 0,
      lineText: '',
      startOffset: 0,
      uri: '/test/index.ts',
    },
  ])
})

test('executeReferenceProvider - error - reference provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    provideReferences() {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostReference.executeReferenceProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute reference provider: TypeError: x is not a function'),
  )
})

test('executeReferenceProvider - error - referenceProvider has wrong shape', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    abc() {},
  })
  // @ts-ignore
  await expect(ExtensionHostReference.executeReferenceProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute reference provider: VError: referenceProvider.provideReferences is not a function'),
  )
})

test('executeReferenceProvider - error - no reference provider found', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  // @ts-ignore
  await expect(ExtensionHostReference.executeReferenceProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute reference provider: No reference provider found for javascript'),
  )
})
