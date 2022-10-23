import * as EditorHandleScrollBarPointerDown from '../src/parts/EditorCommand/EditorCommandHandleScrollBarPointerDown.js'

test('handleScrollBarPointerDown - in middle', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const state = {
    lines: [''],
    selections: [],
    top: TOP,
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    scrollBarHeight: 40,
  }
  const newState = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    200
  )
  expect(newState.deltaY).toBe(400)
})

test('handleScrollBarPointerDown - at bottom', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const state = {
    lines: [''],
    selections: [],
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    top: TOP,
    scrollBarHeight: 40,
  }
  const newState = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    400
  )
  expect(newState.deltaY).toBe(800)
  expect(newState.handleOffset).toBe(20)
})

test('handleScrollBarPointerDown - almost at bottom', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const state = {
    lines: [''],
    selections: [],
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    top: TOP,
    scrollBarHeight: 40,
  }
  const newState = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    370
  )
  expect(newState.deltaY).toBeCloseTo(777.777) // (370 / max) * height
  expect(newState.handleOffset).toBe(20)
})

test('handleScrollBarPointerDown - below scrollbar', () => {
  const ROW_HEIGHT = 20
  const NUMBER_OF_VISIBLE_LINES = 20
  const NUMBER_OF_LINES = 60
  const HEIGHT = 400
  const TOP = 0
  const state = {
    lines: [''],
    selections: [],
    deltaY: 0,
    finalDeltaY: ROW_HEIGHT * (NUMBER_OF_LINES - NUMBER_OF_VISIBLE_LINES),
    height: HEIGHT,
    numberOfVisibleLines: NUMBER_OF_VISIBLE_LINES,
    top: TOP,
    scrollBarHeight: 40,
  }
  const newState1 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    0
  )
  const newState2 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    newState1,
    200
  )
  expect(newState2.deltaY).toBeCloseTo(400) // TODO
  expect(newState2.handleOffset).toBe(20) // TODO
})

// TODO test clicking almost at the top while in middle
// TODO test clicking at the top  while in middle
// TODO test clicking in other middle while in middle
// TODO test clicking almost at the top while almost at top
// TODO test clicking at the top  while at top
// TODO test clicking at the bottom while at bottom
// TODO test clicking at the bottom while in middle
// TODO test clicking at close to the bottom while in middle
// TODO test clicking at close to the bottom while close to the bottom
