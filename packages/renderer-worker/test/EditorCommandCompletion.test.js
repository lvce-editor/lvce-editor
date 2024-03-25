// @ts-nocheck
import { jest } from '@jest/globals'
import * as EditorCompletion from '../src/parts/EditorCommand/EditorCommandCompletion.js'
import * as EditorCommandCursorCharacterLeft from '../src/parts/EditorCommand/EditorCommandCursorCharacterLeft.js'
import * as EditorCommandCursorCharacterRight from '../src/parts/EditorCommand/EditorCommandCursorCharacterRight.js'
import * as EditorCommandCursorDown from '../src/parts/EditorCommand/EditorCommandCursorDown.js'
import * as EditorCommandCursorUp from '../src/parts/EditorCommand/EditorCommandCursorUp.js'
import * as Languages from '../src/parts/Languages/Languages.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  EditorCompletion.state.isOpened = false
})

test.skip('open', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorCompletion.openCompletion({})
})

test.skip('open - cursor changes to row above', async () => {
  Languages.state.loaded = true
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })

  const cursor = {
    rowIndex: 1,
    columnIndex: 0,
  }
  const editor = {
    cursor,
    selections: [{ start: cursor, end: cursor }],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    y: 0,
    x: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
  }
  await EditorCompletion.openCompletion(editor)
  await EditorCommandCursorUp.cursorUp(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(5)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, [909090, expect.any(Number), 'Viewlet.dispose', 'EditorCompletion'])
})

test.skip('open - cursor changes to row below', async () => {
  Languages.state.loaded = true
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })

  const cursor = {
    rowIndex: 1,
    columnIndex: 0,
  }
  const editor = {
    cursor,
    selections: [{ start: cursor, end: cursor }],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    y: 0,
    x: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
  }
  await EditorCompletion.openCompletion(editor)
  await EditorCommandCursorDown.cursorDown(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(5)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, [909090, expect.any(Number), 'Viewlet.dispose', 'EditorCompletion'])
})

test.skip('open - cursor changes to column left - matches word', async () => {
  Languages.state.loaded = true
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })

  const cursor = {
    rowIndex: 1,
    columnIndex: 2,
  }
  const editor = {
    cursor,
    selections: [{ start: cursor, end: cursor }],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
  }
  await EditorCompletion.openCompletion(editor)
  await EditorCommandCursorCharacterLeft.cursorCharacterLeft(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(5)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, ['Viewlet.send', 'EditorCompletion', 'show', 8, 16, [], 1])
})

test.skip('open - cursor changes to column left - matches no word', async () => {
  Languages.state.loaded = true
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })

  const cursor = {
    rowIndex: 1,
    columnIndex: 6,
  }
  const editor = {
    cursor,
    selections: [{ start: cursor, end: cursor }],
    lines: ['line 1', 'line 2    ', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
  }
  await EditorCompletion.openCompletion(editor)
  await EditorCommandCursorCharacterLeft.cursorCharacterLeft(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(5)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, [909090, expect.any(Number), 'Viewlet.dispose', 'EditorCompletion'])
})

test.skip('open - cursor changes to column right - matches word', async () => {
  Languages.state.loaded = true
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })

  const cursor = {
    rowIndex: 1,
    columnIndex: 2,
  }
  const editor = {
    cursor,
    selections: [{ start: cursor, end: cursor }],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
  }
  await EditorCompletion.openCompletion(editor)
  await EditorCommandCursorCharacterRight.cursorCharacterRight(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(5)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, ['Viewlet.send', 'EditorCompletion', 'show', 24, 16, [], 1])
})

test.skip('open - cursor changes to column right - matches no word', async () => {
  Languages.state.loaded = true
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      case 'Viewlet.send':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })

  const cursor = {
    rowIndex: 1,
    columnIndex: 6,
  }
  const editor = {
    cursor,
    selections: [{ start: cursor, end: cursor }],
    lines: ['line 1', 'line 2    ', 'line 3'],
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 2,
    tokenizer: TokenizePlainText,
    lineCache: [
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    id: 1,
    deltaY: 0,
    finalDeltaY: 122,
    height: 400,
    scrollBarHeight: 28,
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 8,
    invalidStartIndex: 0,
  }
  await EditorCompletion.openCompletion(editor)
  await EditorCommandCursorCharacterRight.cursorCharacterRight(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(5)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, [909090, expect.any(Number), 'Viewlet.dispose', 'EditorCompletion'])
})
