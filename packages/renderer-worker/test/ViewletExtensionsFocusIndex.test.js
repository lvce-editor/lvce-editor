import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusIndex from '../src/parts/ViewletExtensions/ViewletExtensionsFocusIndex.js'
import { HEADER_HEIGHT } from '../src/parts/ViewletExtensions/ViewletExtensionsShared.js'

test('focusIndex', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    focusedIndex: 1,
  }
  expect(ViewletExtensionsFocusIndex.focusIndex(state, 2)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusIndex - not in view - causes scrolling down', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
    height: 62,
  }
  expect(ViewletExtensionsFocusIndex.focusIndex(state, 2)).toMatchObject({
    focusedIndex: 2,
    minLineY: 2,
    maxLineY: 3,
  })
})

test('focusIndex - partially in view - causes scrolling down', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 3,
    height: 100 + HEADER_HEIGHT,
    deltaY: 62,
  }
  expect(ViewletExtensionsFocusIndex.focusIndex(state, 2)).toMatchObject({
    focusedIndex: 2,
    minLineY: 1,
    maxLineY: 3,
    negativeMargin: -86,
  })
})

test('focusIndex - not in view - causes scrolling up', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
    height: 62,
  }
  expect(ViewletExtensionsFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
  })
})

test('focusIndex - partially in view - causes scrolling up', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    focusedIndex: 1,
    minLineY: 0,
    maxLineY: 2,
    height: 62,
    deltaY: 10,
    negativeMargin: -10,
  }
  expect(ViewletExtensionsFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
    negativeMargin: -0,
  })
})
