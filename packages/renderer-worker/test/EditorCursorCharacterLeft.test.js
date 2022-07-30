import * as EditorCursorLeft from '../src/parts/EditorCommand/EditorCommandCursorCharacterLeft.js'

test.only('editorCursorCharacterLeft - at start', () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test('editorCursorCharacterLeft - one after start of line', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 1, 0, 1]),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test('editorCursorCharacterLeft - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 1]),
  }

  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test('editorCursorCharacterLeft - at start of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([1, 0, 1, 0]),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
})

test('editorCursorCharacterLeft - emoji - 👮🏽‍♀️', () => {
  const columnIndex = '👮🏽‍♀️'.length
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, columnIndex, 0, columnIndex]),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test('editorCursorCharacterLeft - unicode - zero width space', () => {
  const editor = {
    lines: ['\u200B'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})
