import * as EditorSelectUp from '../src/parts/EditorCommand/EditorCommandSelectUp.js'

test.skip('selectUp', () => {
  const editor = {
    lines: ['1', '2'],
    selections: new Uint32Array([1, 0, 1, 0]),
  }
  const newEditor = EditorSelectUp.selectUp(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 1, 0]))
})

test('selectUp - already at top', () => {
  const editor = {
    lines: ['1', '2'],
    selections: new Uint32Array([0, 0, 1, 0]),
  }
  const newEditor = EditorSelectUp.selectUp(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 1, 0]))
})
