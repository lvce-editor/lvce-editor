import { expect, test } from '@jest/globals'
import * as EditorSelectUp from '../src/parts/EditorCommand/EditorCommandSelectUp.ts'

test('selectUp', () => {
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

test('selectUp - keep indent', () => {
  const editor = {
    lines: ['11', '22'],
    selections: new Uint32Array([1, 1, 1, 1]),
  }
  const newEditor = EditorSelectUp.selectUp(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 1, 1, 1]))
})
