import { beforeAll, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ClipBoard/ClipBoard.ts', () => ({
  writeText: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))

beforeAll(() => {
  // TODO remove this when using newer node version
  if (typeof DOMException === 'undefined') {
    // @ts-ignore
    globalThis.DOMException = globalThis.Error
  }
})

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.ts')
const EditorCopy = await import('../src/parts/EditorCommand/EditorCommandCopy.ts')

beforeAll(() => {
  // Command.setLoad((moduleId) => {
  //   switch (moduleId) {
  //     case ModuleId.ClipBoard:
  //       return import('../src/parts/ClipBoard/ClipBoard.ipc.ts')
  //     default:
  //       throw new Error(`module not found ${moduleId}`)
  //   }
  // })
})

test('editorCopy', async () => {
  // @ts-ignore
  const spy = ClipBoard.writeText.mockImplementation(() => {})
  const editor = {
    uri: '/tmp/foo-fiiHjX/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 3,
      columnIndex: 6,
    },
    completionTriggerCharacters: [],
    selections: new Uint32Array([0, 0, 3, 6]),
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    x: 0,
    y: 55,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [],
  }

  expect(await EditorCopy.copy(editor)).toBe(editor)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('line 1\nline 2\nline 3')
})

test.skip('editorCopy - error from clipboard - document is not focused', async () => {
  // @ts-ignore
  ClipBoard.writeText.mockImplementation(() => {
    throw new DOMException('Document is not focused.')
  })
  // @ts-ignore
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const editor = {
    uri: '/tmp/foo-fiiHjX/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 3,
      columnIndex: 6,
    },
    completionTriggerCharacters: [],
    selections: new Uint32Array([0, 0, 3, 6]),
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    x: 0,
    y: 55,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [],
  }
  await expect(EditorCopy.copy(editor)).rejects.toThrow(new DOMException('Document is not focused.'))
})
