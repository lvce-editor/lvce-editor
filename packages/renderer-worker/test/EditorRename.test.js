import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostRename.js',
  () => {
    return {
      executePrepareRenameProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
      executeRenameProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostRename = await import(
  '../src/parts/ExtensionHost/ExtensionHostRename.js'
)
const EditorRename = await import('../src/parts/EditorRename/EditorRename.js')

// TODO rename open or openWidget, but should be consistent with editorCompletions, editorHover
test('open - can rename', async () => {
  RendererProcess.state.send = jest.fn()
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
  }

  // @ts-ignore
  ExtensionHostRename.executePrepareRenameProvider.mockImplementation(() => {
    return {
      canRename: true,
    }
  })
  await EditorRename.open(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([4512, 0, 20])
})

test('open - cannot rename', async () => {
  RendererProcess.state.send = jest.fn()
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  // @ts-ignore
  ExtensionHostRename.executePrepareRenameProvider.mockImplementation(() => {
    return {
      canRename: false,
    }
  })
  await EditorRename.open(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3700,
    'You cannot rename this element',
    0,
    20,
  ])
})

// TODO test errors

// TODO test single workspace edit

// TODO test workspace edit that doesn't match open file

test('finish - empty workspace edits', async () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ 'newName',
        ])
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  ExtensionHostRename.executeRenameProvider.mockImplementation(() => {
    return []
  })
  await EditorRename.finish(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    4513,
  ])
})

test('abort', async () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  RendererProcess.state.send = jest.fn()
  EditorRename.abort()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([4514])
})
