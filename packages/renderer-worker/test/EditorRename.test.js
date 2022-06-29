import { jest } from '@jest/globals'

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

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const ExtensionHostRename = await import(
  '../src/parts/ExtensionHost/ExtensionHostRename.js'
)
const EditorRename = await import('../src/parts/EditorRename/EditorRename.js')

// TODO rename open or openWidget, but should be consistent with editorCompletions, editorHover
test('open - can rename', async () => {
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
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorRename.open(editor)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(4512, 0, 20)
})

test('open - cannot rename', async () => {
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
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorRename.open(editor)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    3700,
    'You cannot rename this element',
    0,
    20
  )
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
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorRename.abort()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(4514)
})
