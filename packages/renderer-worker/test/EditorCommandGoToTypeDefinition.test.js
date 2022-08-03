import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js',
  () => ({
    executeTypeDefinitionProvider: jest.fn().mockImplementation(() => {
      throw new Error('not implemented')
    }),
  })
)
jest.unstable_mockModule(
  '../src/parts/EditorCommandShowMessage/EditorCommandShowMessage.js',
  () => ({
    editorShowMessage: jest.fn().mockImplementation(() => {
      throw new Error('not implemented')
    }),
  })
)

const ExtensionHostTypeDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js'
)
const EditorGoToTypeDefinition = await import(
  '../src/parts/EditorCommandGoToTypeDefinition/EditorCommandGoToTypeDefinition.js'
)

const EditorShowMessage = await import(
  '../src/parts/EditorCommandShowMessage/EditorCommandShowMessage.js'
)

beforeEach(() => {
  jest.resetAllMocks()
})

test('editorGoToTypeDefinition', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selection: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  ExtensionHostTypeDefinition.executeTypeDefinitionProvider.mockImplementation(
    () => {
      return {
        uri: '/test/add.ts',
        startOffset: 1,
        endOffset: 1,
      }
    }
  )
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
  await EditorGoToTypeDefinition.editorGoToTypeDefinition(editor, cursor)
})

test('editorGoToTypeDefinition - startOffset is 0', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selection: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  ExtensionHostTypeDefinition.executeTypeDefinitionProvider.mockImplementation(
    () => {
      return {
        uri: '/test/add.ts',
        startOffset: 0,
        endOffset: 0,
      }
    }
  )
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
  await EditorGoToTypeDefinition.editorGoToTypeDefinition(editor, cursor)
})

test('editorGoToTypeDefinition - error', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
  }
  // @ts-ignore
  ExtensionHostTypeDefinition.executeTypeDefinitionProvider.mockImplementation(
    () => {
      throw new TypeError('x is not a function')
    }
  )
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await EditorGoToTypeDefinition.editorGoToTypeDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    editor.cursor,
    'TypeError: x is not a function',
    true
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new TypeError('x is not a function'))
})

test('editorGoToTypeDefinition - error - no type definition provider found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
    selections: [],
  }
  // @ts-ignore
  ExtensionHostTypeDefinition.executeTypeDefinitionProvider.mockImplementation(
    () => {
      throw new Error(
        'Failed to execute type definition provider: No type definition provider found'
      )
    }
  )
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await EditorGoToTypeDefinition.editorGoToTypeDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    editor.cursor,
    'Error: Failed to execute type definition provider: No type definition provider found',
    false
  )
  expect(spy).not.toHaveBeenCalled()
})

test('editorGoToTypeDefinition - no type definition found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/test/index.ts',
    selections: [],
  }
  // @ts-ignore
  ExtensionHostTypeDefinition.executeTypeDefinitionProvider.mockImplementation(
    () => {
      return undefined
    }
  )
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToTypeDefinition.editorGoToTypeDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    editor.cursor,
    'No type definition found',
    false
  )
})
