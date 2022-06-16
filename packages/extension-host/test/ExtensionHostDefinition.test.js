import * as ExtensionHostDefinition from '../src/parts/ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostDefinition.state.definitionProviders = Object.create(null)
  TextDocument.state.textDocuments = Object.create(null)
})

test('executeDefinitionProvider', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 15,
        endOffset: 22,
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await ExtensionHostDefinition.executeDefinitionProvider(1, 0)).toEqual(
    { endOffset: 22, startOffset: 15, uri: '/test/index.js' }
  )
})

test('executeDefinitionProvider - definition.startOffset is zero', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 0,
        endOffset: 0,
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await ExtensionHostDefinition.executeDefinitionProvider(1, 0)).toEqual(
    { endOffset: 0, startOffset: 0, uri: '/test/index.js' }
  )
})

test('executeDefinitionProvider - error - definition must be of type object but is array', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return []
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition must be of type object but is []'
    )
  )
})

test('executeDefinitionProvider - error - definition must be of type object but is function', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return () => {}
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition must be of type object but is [Function (anonymous)]'
    )
  )
})

test('executeDefinitionProvider - error - definition.uri must be of type string', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {}
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition.uri must be of type string'
    )
  )
})

test('executeDefinitionProvider - error - definition.startOffset must be of type number', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition.startOffset must be of type number'
    )
  )
})

test('executeDefinitionProvider - error - definition.endOffset must be of type number', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 1,
      }
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition.endOffset must be of type number'
    )
  )
})

test('executeDefinitionProvider - error - definition provider throws error', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      throw new TypeError('x is not a function')
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: TypeError: x is not a function'
    )
  )
})

test('executeDefinitionProvider - no definition found', async () => {
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return undefined
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await ExtensionHostDefinition.executeDefinitionProvider(1, 0)).toBe(
    undefined
  )
})
