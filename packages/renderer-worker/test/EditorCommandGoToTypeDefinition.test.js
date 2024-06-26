import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'

jest.unstable_mockModule('../src/parts/TypeDefinition/TypeDefinition.js', () => ({
  getTypeDefinition: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandShowMessage.js', () => ({
  editorShowMessage: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => ({
  handleError: jest.fn(),
}))

const EditorGoToTypeDefinition = await import('../src/parts/EditorCommand/EditorCommandGoToTypeDefinition.js')
const EditorSelection = await import('../src/parts/EditorSelection/EditorSelection.js')
const EditorShowMessage = await import('../src/parts/EditorCommand/EditorCommandShowMessage.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const TypeDefinition = await import('../src/parts/TypeDefinition/TypeDefinition.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('editorGoToTypeDefinition', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  TypeDefinition.getTypeDefinition.mockImplementation(() => {
    return {
      uri: '/test/add.ts',
      startOffset: 1,
      endOffset: 1,
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 909090:
        // @ts-ignore
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorGoToTypeDefinition.goToTypeDefinition(editor)
})

test('editorGoToTypeDefinition - startOffset is 0', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  TypeDefinition.getTypeDefinition.mockImplementation(() => {
    return {
      uri: '/test/add.ts',
      startOffset: 0,
      endOffset: 0,
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 909090:
        // @ts-ignore
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorGoToTypeDefinition.goToTypeDefinition(editor)
})

test('editorGoToTypeDefinition - error', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
  }
  // @ts-ignore
  TypeDefinition.getTypeDefinition.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToTypeDefinition.goToTypeDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(editor, 0, 0, 'TypeError: x is not a function', true)
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(new TypeError('x is not a function'), false)
})

test('editorGoToTypeDefinition - error - no type definition provider found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
  }
  // @ts-ignore
  TypeDefinition.getTypeDefinition.mockImplementation(() => {
    throw new Error('Failed to execute type definition provider: No type definition provider found')
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await EditorGoToTypeDefinition.goToTypeDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    'Error: Failed to execute type definition provider: No type definition provider found',
    false,
  )
  expect(spy).not.toHaveBeenCalled()
})

test('editorGoToTypeDefinition - no type definition found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/test/index.ts',
  }
  // @ts-ignore
  TypeDefinition.getTypeDefinition.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToTypeDefinition.goToTypeDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(editor, 0, 0, "No type definition found for 'line'", false)
})
