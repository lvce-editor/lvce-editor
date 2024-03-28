import * as VirtualListFocusIndex from '../src/parts/VirtualList/VirtualListFocusIndex.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('focusIndex', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 0,
    headerHeight: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusIndex - not in view - causes scrolling down', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
    height: 62,
    headerHeight: 0,
    deltaY: 62,
    itemHeight: 62,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 2)).toMatchObject({
    focusedIndex: 2,
    minLineY: 1,
    maxLineY: 3,
  })
})

test('focusIndex - partially in view - causes scrolling down', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 3,
    height: 100,
    deltaY: 62,
    headerHeight: 0,
    finalDeltaY: 3 * 62 - 100,
    itemHeight: 62,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 2)).toMatchObject({
    focusedIndex: 2,
    minLineY: 0,
    maxLineY: 3,
    deltaY: 24,
  })
})

test('focusIndex - less items - at start', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: -1,
    minLineY: 0,
    maxLineY: 3,
    height: 558,
    deltaY: 0,
    headerHeight: 0,
    finalDeltaY: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 3,
    deltaY: 0,
  })
})

test('focusIndex - less items - at end', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: -1,
    minLineY: 0,
    maxLineY: 3,
    height: 558,
    deltaY: 0,
    headerHeight: 0,
    finalDeltaY: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 2)).toMatchObject({
    focusedIndex: 2,
    minLineY: 0,
    maxLineY: 3,
    deltaY: 0,
  })
})

test('focusIndex - not in view - causes scrolling up', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
    height: 62,
    headerHeight: 0,
    deltaY: 62,
    itemHeight: 62,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 2,
  })
})

test('focusIndex - partially in view - causes scrolling up', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 1,
    minLineY: 0,
    maxLineY: 2,
    height: 62,
    deltaY: 10,
    itemHeight: 62,
    minimumSliderSize: 20,
    headerHeight: 0,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 2,
    deltaY: 0,
  })
})
