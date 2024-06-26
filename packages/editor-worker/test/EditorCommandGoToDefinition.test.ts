import { beforeEach, expect, jest, test } from '@jest/globals'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

jest.unstable_mockModule('../src/parts/Definition/Definition.ts', () => ({
  getDefinition: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandShowMessage.ts', () => ({
  editorShowMessage: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/Command/Command.ts', () => ({
  execute: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.ts', () => ({
  handleError: jest.fn(),
}))

const Definition = await import('../src/parts/Definition/Definition.ts')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.ts')
const EditorGoToDefinition = await import('../src/parts/EditorCommand/EditorCommandGoToDefinition.ts')
const EditorShowMessage = await import('../src/parts/EditorCommand/EditorCommandShowMessage.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test.skip('editorGoToDefinition', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  Definition.getDefinition.mockImplementation(() => {
    return {
      uri: '/test/add.ts',
      startOffset: 1,
      endOffset: 1,
    }
  })
  // @ts-ignore
  RendererWorker.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 909090:
        // @ts-ignore
        const callbackId = message[1]
        // @ts-ignore
        RendererWorker.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorGoToDefinition.goToDefinition(editor)
})

test.skip('editorGoToDefinition - start offset is 0', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  // @ts-ignore
  Definition.getDefinition.mockImplementation(() => {
    return {
      uri: '/test/add.ts',
      startOffset: 0,
      endOffset: 0,
    }
  })
  // @ts-ignore
  RendererWorker.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message[0]) {
      case 909090:
        // @ts-ignore
        const callbackId = message[1]
        // @ts-ignore
        RendererWorker.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorGoToDefinition.goToDefinition(editor)
})

test.skip('editorGoToDefinition - error', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    selections: new Uint32Array([0, 0, 0, 0]),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
  }
  // @ts-ignore
  Definition.getDefinition.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToDefinition.goToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(editor, 0, 0, 'TypeError: x is not a function', true)
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(new TypeError('x is not a function'), false)
})

// TODO test no definition provider registered

test.skip('editorGoToDefinition - error - no definition provider found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/tmp/index.ts',
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  // @ts-ignore
  Definition.getDefinition.mockImplementation(() => {
    throw new Error('Failed to execute definition provider: No definition provider found')
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await EditorGoToDefinition.goToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    'Error: Failed to execute definition provider: No definition provider found',
    false,
  )
  expect(spy).not.toHaveBeenCalled()
})

test.skip('editorGoToDefinition - no definition found', async () => {
  const editor = {
    lines: ['line 1', 'line 1'],
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/test/index.ts',
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  // @ts-ignore
  Definition.getDefinition.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToDefinition.goToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(editor, 0, 0, "No definition found for 'line'", false)
})

test.skip('editorGoToDefinition - no definition found and no word at position', async () => {
  const editor = {
    lines: ['    ', ''],
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    uri: '/test/index.ts',
    selections: new Uint32Array([0, 0]),
  }
  // @ts-ignore
  Definition.getDefinition.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  await EditorGoToDefinition.goToDefinition(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(editor, 0, 0, 'No definition found', false)
})
