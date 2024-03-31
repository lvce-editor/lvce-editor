import { beforeEach, expect, test } from '@jest/globals'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as ExtensionHostTypeDefinition from '../src/parts/ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.ts'

beforeEach(() => {
  ExtensionHostTypeDefinition.reset()
})

test('executeTypeDefinitionProvider', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.ts',
        startOffset: 15,
        endOffset: 22,
      }
    },
  })
  // @ts-ignore
  expect(await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).toEqual({
    endOffset: 22,
    startOffset: 15,
    uri: '/test/index.ts',
  })
})

test('executeTypeDefinitionProvider - definition.startOffset is zero', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.ts',
        startOffset: 0,
        endOffset: 0,
      }
    },
  })
  // @ts-ignore
  expect(await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).toEqual({
    endOffset: 0,
    startOffset: 0,
    uri: '/test/index.ts',
  })
})

test('executeTypeDefinitionProvider - error - definition must be of type object but is array', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return []
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute type definition provider: VError: invalid type definition result: typeDefinition must be of type object but is []'),
  )
})

test('executeTypeDefinitionProvider - error - definition must be of type object but is function', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return () => {}
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition must be of type object but is () => { }',
    ),
  )
})

test('executeTypeDefinitionProvider - error - definition.uri must be of type string', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {}
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute type definition provider: VError: invalid type definition result: typeDefinition.uri must be of type string'),
  )
})

test('executeTypeDefinitionProvider - error - definition.startOffset must be of type number', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.ts',
      }
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition.startOffset must be of type number',
    ),
  )
})

test('executeTypeDefinitionProvider - error - definition.endOffset must be of type number', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.ts',
        startOffset: 1,
      }
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute type definition provider: VError: invalid type definition result: typeDefinition.endOffset must be of type number'),
  )
})

test('executeTypeDefinitionProvider - error - definition provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute type definition provider: TypeError: x is not a function'),
  )
})

test('executeTypeDefinitionProvider - error - definition provider throws error null', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      throw null
    },
  })
  // @ts-ignore
  await expect(ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute type definition provider: NonError: null'),
  )
})

test.skip('executeTypeDefinitionProvider - no type definition found', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return undefined
    },
  })
  // @ts-ignore
  expect(await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)).toBe(undefined)
})
