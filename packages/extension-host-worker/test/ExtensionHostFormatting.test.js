import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostFormatting.reset()
})

test('executeFormattingProvider', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 15,
        endOffset: 22,
      }
    },
  })
  expect(await ExtensionHostFormatting.executeDefinitionProvider(1, 0)).toEqual(
    {
      endOffset: 22,
      startOffset: 15,
      uri: '/test/index.js',
    }
  )
})

test('executeDefinitionProvider - definition.startOffset is zero', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 0,
        endOffset: 0,
      }
    },
  })
  expect(await ExtensionHostFormatting.executeDefinitionProvider(1, 0)).toEqual(
    {
      endOffset: 0,
      startOffset: 0,
      uri: '/test/index.js',
    }
  )
})

test('executeDefinitionProvider - error - definition must be of type object but is array', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return []
    },
  })
  await expect(
    ExtensionHostFormatting.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition must be of type object but is []'
    )
  )
})

test('executeDefinitionProvider - error - definition must be of type object but is function', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return () => {}
    },
  })
  await expect(
    ExtensionHostFormatting.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition must be of type object but is () => {}'
    )
  )
})

test('executeDefinitionProvider - error - definition.uri must be of type string', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {}
    },
  })
  await expect(
    ExtensionHostFormatting.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition.uri must be of type string'
    )
  )
})

test('executeDefinitionProvider - error - definition.startOffset must be of type number', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
      }
    },
  })
  await expect(
    ExtensionHostFormatting.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition.startOffset must be of type number'
    )
  )
})

test('executeDefinitionProvider - error - definition.endOffset must be of type number', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.js',
        startOffset: 1,
      }
    },
  })
  await expect(
    ExtensionHostFormatting.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: VError: invalid definition result: definition.endOffset must be of type number'
    )
  )
})

test('executeDefinitionProvider - error - definition provider throws error', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      throw new TypeError('x is not a function')
    },
  })
  await expect(
    ExtensionHostFormatting.executeDefinitionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute definition provider: TypeError: x is not a function'
    )
  )
})

test.skip('executeDefinitionProvider - no definition found', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostFormatting.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return undefined
    },
  })
  expect(await ExtensionHostFormatting.executeDefinitionProvider(1, 0)).toBe(
    undefined
  )
})
