import * as EditorSetDelta from '../src/parts/EditorCommand/EditorCommandSetDelta.js'

test('setDeltaYFixedValue', () => {
  const editor = {
    lines: ['a', 'abcd'],
    finalDeltaY: 100,
    deltaY: 10,
    numberOfVisibleLines: 10,
    height: 100,
    scrollBarHeight: 10,
    minLineY: 1,
    maxLineY: 11,
    itemHeight: 20,
  }
  expect(EditorSetDelta.setDeltaYFixedValue(editor, 20)).toMatchObject({
    deltaY: 20,
    minLineY: 1,
    maxLineY: 11,
    scrollBarY: 18,
  })
})
