import * as ExtensionHostTypeDefinition from '../src/parts/ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostTypeDefinition.state.definitionProviders = Object.create(null)
  TextDocument.state.textDocuments = Object.create(null)
})

test('executeTypeDefinitionProvider', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 15,
        endOffset: 22,
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).toEqual({ endOffset: 22, startOffset: 15, uri: '/test/index.js' })
})

test('executeTypeDefinitionProvider - definition.startOffset is zero', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 0,
        endOffset: 0,
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).toEqual({ endOffset: 0, startOffset: 0, uri: '/test/index.js' })
})

test('executeTypeDefinitionProvider - error - definition must be of type object but is array', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return []
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition must be of type object but is []'
    )
  )
})

test('executeTypeDefinitionProvider - error - definition must be of type object but is function', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return () => {}
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition must be of type object but is [Function (anonymous)]'
    )
  )
})

test('executeTypeDefinitionProvider - error - definition.uri must be of type string', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {}
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition.uri must be of type string'
    )
  )
})

test('executeTypeDefinitionProvider - error - definition.startOffset must be of type number', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.js',
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition.startOffset must be of type number'
    )
  )
})

test('executeTypeDefinitionProvider - error - definition.endOffset must be of type number', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 1,
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute type definition provider: VError: invalid type definition result: typeDefinition.endOffset must be of type number'
    )
  )
})

test('executeTypeDefinitionProvider - error - definition provider throws error', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      throw new TypeError('x is not a function')
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute type definition provider: TypeError: x is not a function'
    )
  )
})

test('executeTypeDefinitionProvider - no type definition found', async () => {
  ExtensionHostTypeDefinition.registerTypeDefinitionProvider({
    languageId: 'javascript',
    provideTypeDefinition() {
      return undefined
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(1, 0)
  ).toBe(undefined)
})
