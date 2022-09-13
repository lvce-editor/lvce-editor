import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostDefinition.js',
  () => ({
    executeDefinitionProvider: jest.fn().mockImplementation(() => {
      throw new Error('not implemented')
    }),
  })
)
jest.unstable_mockModule(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js',
  () => ({
    editorShowMessage: jest.fn().mockImplementation(() => {
      throw new Error('not implemented')
    }),
  })
)
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionHostDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostDefinition.js'
)
const EditorGoToDefinition = await import(
  '../src/parts/EditorCommand/EditorCommandGoToDefinition.js'
)

const EditorShowMessage = await import(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js'
)

beforeEach(() => {
  jest.resetAllMocks()
})

test('editorGoToDefinition', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  ExtensionHostDefinition.executeDefinitionProvider.mockImplementation(() => {
    return {
      uri: '/test/add.ts',
      startOffset: 1,
      endOffset: 1,
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorGoToDefinition.editorGoToDefinition(editor)
})

test('editorGoToDefinition - start offset is 0', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  ExtensionHostDefinition.executeDefinitionProvider.mockImplementation(() => {
    return {
      uri: '/test/add.ts',
      startOffset: 0,
      endOffset: 0,
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorGoToDefinition.editorGoToDefinition(editor)
})

test('editorGoToDefinition - error', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    selections: new Uint32Array([0, 0, 0, 0]),
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
  }
  // @ts-ignore
  ExtensionHostDefinition.executeDefinitionProvider.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await EditorGoToDefinition.editorGoToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    'TypeError: x is not a function',
    true
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new TypeError('x is not a function'))
})

// TODO test no definition provider registered

test('editorGoToDefinition - error - no definition provider found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  // @ts-ignore
  ExtensionHostDefinition.executeDefinitionProvider.mockImplementation(() => {
    throw new Error(
      'Failed to execute definition provider: No definition provider found'
    )
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await EditorGoToDefinition.editorGoToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    'Error: Failed to execute definition provider: No definition provider found',
    false
  )
  expect(spy).not.toHaveBeenCalled()
})

test('editorGoToDefinition - no definition found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/test/index.ts',
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  // @ts-ignore
  ExtensionHostDefinition.executeDefinitionProvider.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToDefinition.editorGoToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    `No definition found for 'line'`,
    false
  )
})

test('editorGoToDefinition - no definition found and no word at position', async () => {
  const editor = {
    lines: ['    ', ''],
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/test/index.ts',
    selections: new Uint32Array([0, 0]),
  }
  // @ts-ignore
  ExtensionHostDefinition.executeDefinitionProvider.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToDefinition.editorGoToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    `No definition found`,
    false
  )
})
