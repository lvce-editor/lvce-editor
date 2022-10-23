import * as EditorHandleScrollBarMove from '../src/parts/EditorCommand/EditorCommandHandleScrollBarMove.js'
import * as EditorHandleScrollBarPointerDown from '../src/parts/EditorCommand/EditorCommandHandleScrollBarPointerDown.js'

test('handleScrollBarMove', () => {
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
  const newState1 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    184
  )
  const newState2 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    newState1,
    184
  )
  const newState3 = EditorHandleScrollBarMove.editorHandleScrollBarMove(
    newState2,
    190
  )
  expect(newState3.deltaY).toBeCloseTo(377.777)
})

test.skip('editorHandleScrollBarMove - another test', () => {
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
  const newState1 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    0
  )
  const newState2 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    newState1,
    34
  )
  const newState3 = EditorHandleScrollBarMove.editorHandleScrollBarMove(
    newState2,
    36
  )
  expect(newState3.deltaY).toBe(0)
})

test('editorHandleScrollBarMove - click scroll bar at top and move down', () => {
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
  // position scrollbar at [180, 220]
  const newState1 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    200
  )
  // sets click offset to 0
  const newState2 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    newState1,
    180
  )
  // moves down 4 pixels
  const newState3 = EditorHandleScrollBarMove.editorHandleScrollBarMove(
    newState2,
    184
  )
  expect(newState3.deltaY).toBeCloseTo(408.888) // ((180 + 4) / 360) * 800
})

test('editorHandleScrollBarMove - click scroll bar in middle and move down', () => {
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
  // position scrollbar at [180, 220]
  const newState1 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    200
  )
  // sets click offset to 20
  const newState2 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    newState1,
    200
  )
  // moves down 2 pixels
  const newState3 = EditorHandleScrollBarMove.editorHandleScrollBarMove(
    newState2,
    202
  )
  expect(newState3.deltaY).toBeCloseTo(404.444) // ((180 + 2) / 360) * 800
})

test('editorHandleScrollBarMove - click scroll bar at bottom and move down', () => {
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
  // position scrollbar at [180, 220]
  const newState1 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    state,
    200
  )
  // sets click offset to 39
  const newState2 = EditorHandleScrollBarPointerDown.handleScrollBarPointerDown(
    newState1,
    219
  )
  // moves down 3 pixels
  const newState3 = EditorHandleScrollBarMove.editorHandleScrollBarMove(
    newState2,
    222
  )
  expect(newState3.deltaY).toBeCloseTo(406.666) // ((180 + 3) / 360) * 800
})

// TODO test scrolling all the way to the top
// TODO test scrolling all the way to the bottom

// TODO test scrolling up from top (noop)
// TODO test scrolling down from top

// TODO test scrolling up from bottom
// TODO test scrolling down from bottom (noop)
