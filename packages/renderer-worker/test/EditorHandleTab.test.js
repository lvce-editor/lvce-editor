import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostTabCompletion.js',
  () => {
    return {
      executeTabCompletionProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const EditorHandleTab = await import(
  '../src/parts/EditorCommand/EditorCommandHandleTab.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const ExtensionHostTabCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostTabCompletion.js'
)

test.skip('editorHandleTab - no tab completion available', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['a'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    undoStack: [],
  }
  // @ts-ignore
  ExtensionHostTabCompletion.executeTabCompletionProvider.mockImplementation(
    () => {
      return null
    }
  )
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['a  '],
  })
})

test.skip('editorHandleTab - tab completion available', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['a'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
  }
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 386:
        SharedProcess.state.receive({
          id: message.id,
          result: {
            inserted: 'bc',
            deleted: 1,
            type: /* Snippet */ 2,
          },
        })
        break
      case 385:
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['bc'],
  })
})

test.skip('editorHandleTab - indent one selection - single line', async () => {
  const editor = {
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
    ],
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['  '],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
  })
})

test.skip('editorHandleTab - indent one selection - multiple lines', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 2,
        },
      },
    ],
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['line 1', '  line 2', '  line 3', 'line 4'],
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 3,
        },
        end: {
          rowIndex: 2,
          columnIndex: 4,
        },
      },
    ],
    cursor: {
      rowIndex: 2,
      columnIndex: 4,
    },
  })
})
