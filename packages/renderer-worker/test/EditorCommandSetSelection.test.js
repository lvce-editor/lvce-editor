import * as EditorCommandSetSelections from '../src/parts/EditorCommand/EditorCommandSetSelections.js'

test('setSelections', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  expect(
    EditorCommandSetSelections.setSelections(
      editor,
      new Uint32Array([0, 0, 0, 1])
    )
  ).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 1]),
  })
})

test('setSelections - scroll down', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
    minLineY: 0,
    maxLineY: 1,
  }
  expect(
    EditorCommandSetSelections.setSelections(
      editor,
      new Uint32Array([2, 0, 2, 0])
    )
  ).toMatchObject({
    selections: new Uint32Array([2, 0, 2, 0]),
    minLineY: 2,
    maxLineY: 3,
  })
})

test('setSelections - scroll up', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([2, 0, 0, 2]),
    minLineY: 2,
    maxLineY: 3,
  }
  expect(
    EditorCommandSetSelections.setSelections(
      editor,
      new Uint32Array([0, 0, 0, 0])
    )
  ).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
    minLineY: 0,
    maxLineY: 1,
  })
})
