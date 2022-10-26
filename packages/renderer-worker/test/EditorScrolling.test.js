import * as EditorScrolling from '../src/parts/Editor/EditorScrolling.js'

test('setDeltaY - scroll down', () => {
  const editor = {
    deltaY: 0,
    numberOfVisibleLines: 2,
    finalDeltaY: 100,
    minLineY: 0,
    maxLineY: 2,
    scrollBarHeight: 10,
    height: 400,
    itemHeight: 20,
  }
  expect(EditorScrolling.setDeltaY(editor, 80)).toMatchObject({
    minLineY: 4,
    maxLineY: 6,
    deltaY: 80,
    scrollBarY: 312,
  })
})
