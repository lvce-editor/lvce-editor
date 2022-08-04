import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
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

const EditorTabCompletion = await import(
  '../src/parts/EditorCommand/EditorCommandTabCompletion.js'
)
const ExtensionHostTabCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostTabCompletion.js'
)
const EditorSelection = await import(
  '../src/parts/EditorSelection/EditorSelection.js'
)

test('editorTabCompletion - no tab completion available', async () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  // @ts-ignore
  ExtensionHostTabCompletion.executeTabCompletionProvider.mockImplementation(
    () => {
      return null
    }
  )
  expect(await EditorTabCompletion.editorTabCompletion(editor)).toBe(editor)
})

test('editorTabCompletion - tab completion available', async () => {
  const editor = {
    lines: ['a'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    lineCache: [],
    undoStack: [],
  }
  // @ts-ignore
  ExtensionHostTabCompletion.executeTabCompletionProvider.mockImplementation(
    () => {
      return {
        inserted: 'bc',
        deleted: 1,
        type: /* Snippet */ 2,
      }
    }
  )
  expect(await EditorTabCompletion.editorTabCompletion(editor)).toMatchObject({
    lines: ['bc'],
  })
})

// TODO test multiline snippet

test.only('editorTabCompletion - multiline snippet', async () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    lineCache: [],
    minLineY: 0,
    maxLineY: 1,
    deltaY: 0,
    invalidStartIndex: 0,
    height: 200,
    numberOfVisibleLines: 10,
    rowHeight: 20,
    columnWidth: 8,
    scrollBarHeight: 10,
    undoStack: [],
  }
  // @ts-ignore
  ExtensionHostTabCompletion.executeTabCompletionProvider.mockImplementation(
    () => {
      return {
        inserted: `<div>
  $0
</div>`,
        deleted: 1,
        type: /* Snippet */ 2,
      }
    }
  )
  expect(await EditorTabCompletion.editorTabCompletion(editor)).toMatchObject({
    lines: ['<div>', '  $0', '</div>'],
  })
})
