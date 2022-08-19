import * as EditorSelectDown from '../src/parts/EditorCommand/EditorCommandSelectDown.js'

test('selectDown', () => {
  const editor = {
    lines: ['1', '2'],
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 1, 0]))
})

test('selectDown - already at bottom', () => {
  const editor = {
    lines: ['1', '2'],
    selections: new Uint32Array([0, 0, 1, 0]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 1, 0]))
})

test('selectDown - keep indent', () => {
  const editor = {
    lines: ['11', '22'],
    selections: new Uint32Array([0, 1, 0, 1]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 1, 1, 1]))
})
