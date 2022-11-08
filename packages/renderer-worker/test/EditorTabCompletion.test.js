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
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    printError: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js',
  () => {
    return {
      showErrorMessage: jest.fn(() => {
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
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)
const EditorShowMessage = await import(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js'
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
  expect(await EditorTabCompletion.tabCompletion(editor)).toBe(editor)
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
  expect(await EditorTabCompletion.tabCompletion(editor)).toMatchObject({
    lines: ['bc'],
  })
})

// TODO test multiline snippet

test('editorTabCompletion - multiline snippet', async () => {
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
  expect(await EditorTabCompletion.tabCompletion(editor)).toMatchObject({
    lines: ['<div>', '  $0', '</div>'],
  })
})

test('editorTabCompletion - error', async () => {
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

  const error = new Error('Failed to execute tab completion provider: no')
  error.stack = `    at tokenizeCss (/test/builtin.language-features-css/src/parts/Tokenize/tokenizeCss.js:52:17)
at Module.cssTabCompletion (/test/builtin.language-features-css/src/parts/TabCompletion/TabCompletion.js:12:18)
at Module.provideTabCompletion (/test/builtin.language-features-css/src/parts/ExtensionHost/ExtensionHostTabCompletionProviderCss.js:12:39)`
  // @ts-ignore
  error.codeFrame = `  50 |           state = State.TopLevelContent
51 |         } else {
> 52 |           throw new Error('no')
   |                 ^
53 |         }
54 |         break
55 |       case State.AfterSelector:"`
  // @ts-ignore
  ExtensionHostTabCompletion.executeTabCompletionProvider.mockImplementation(
    () => {
      throw error
    }
  )
  // @ts-ignore
  ErrorHandling.printError.mockImplementation(() => {})
  // @ts-ignore
  EditorShowMessage.showErrorMessage.mockImplementation(() => {})
  await EditorTabCompletion.tabCompletion(editor)
  expect(ErrorHandling.printError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.printError).toHaveBeenCalledWith(error)
  expect(EditorShowMessage.showErrorMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.showErrorMessage).toHaveBeenCalledWith(
    editor,
    0,
    1,
    'Error: Failed to execute tab completion provider: no'
  )
})
