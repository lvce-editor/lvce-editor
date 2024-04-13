import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostRename.js', () => {
  return {
    executePrepareRenameProvider: jest.fn(() => {
      throw new Error('not implemented')
    }),
    executeRenameProvider: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

const ExtensionHostRename = await import('../src/parts/ExtensionHost/ExtensionHostRename.js')
const EditorRename = await import('../src/parts/EditorRename/EditorRename.js')
const Command = await import('../src/parts/Command/Command.js')

beforeAll(() => {
  Command.setLoad((moduleId) => {
    switch (moduleId) {
      case ModuleId.EditorError:
        return import('../src/parts/EditorError/EditorError.ipc.js')
      default:
        throw new Error(`module not found ${moduleId}`)
    }
  })
})

// TODO rename open or openWidget, but should be consistent with editorCompletions, editorHover
test.skip('open - can rename', async () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }

  // @ts-ignore
  ExtensionHostRename.executePrepareRenameProvider.mockImplementation(() => {
    return {
      canRename: true,
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorRename.open()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(4512, 0, 20)
})

test.skip('open - cannot rename', async () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  // @ts-ignore
  ExtensionHostRename.executePrepareRenameProvider.mockImplementation(() => {
    return {
      canRename: false,
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorRename.open()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('EditorError.show', 'You cannot rename this element', 0, 20)
})

// TODO test errors

// TODO test single workspace edit

// TODO test workspace edit that doesn't match open file

test.skip('finish - empty workspace edits', async () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return 'newName'
  })

  // @ts-ignore
  ExtensionHostRename.executeRenameProvider.mockImplementation(() => {
    return []
  })
  await EditorRename.finish(editor)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(4513)
})

test.skip('abort', async () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorRename.abort()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(4514)
})
