import * as EditorCursorAndSelection from '../src/parts/Editor/EditorCursorAndSelection.js'

test('getVisible - cursor', () => {
  const editor = {
    selections: new Uint32Array([0, 0, 0, 0]),
    minLineY: 0,
    maxLineY: 10,
    rowHeight: 20,
    columnWidth: 10,
  }
  expect(EditorCursorAndSelection.getVisible(editor)).toEqual({
    cursors: new Uint32Array([0, 0]),
    selections: new Uint32Array([]),
  })
})

test('getVisible - selection', () => {
  const editor = {
    selections: new Uint32Array([0, 0, 0, 1]),
    minLineY: 0,
    maxLineY: 10,
    rowHeight: 20,
    columnWidth: 10,
  }
  expect(EditorCursorAndSelection.getVisible(editor)).toEqual({
    cursors: new Uint32Array([0, 10]),
    selections: new Uint32Array([0, 0, 10, 20]),
  })
})

test('getVisible - multiple selections', () => {
  const editor = {
    top: 10,
    left: 20,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 4,
    maxLineY: 8,
    lines: [
      'line 1',
      'line 2',
      'line 3',
      'line 4',
      'line 5',
      'line 6',
      'line 7',
      'line 8',
      'line 9',
      'line 10',
    ],
    // prettier-ignore
    selections: new Uint32Array([
      1, 3, 2, 4,
      3, 0, 6, 6,
      8, 2, 8, 3,
    ]),
  }
  expect(EditorCursorAndSelection.getVisible(editor)).toEqual({
    cursors: new Uint32Array([80, 24]),
    selections: new Uint32Array([
      /* top */ 0, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 20, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 40, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 80, /* left */ 16, /* width */ 8, /* height */ 20,
    ]),
  })
})
