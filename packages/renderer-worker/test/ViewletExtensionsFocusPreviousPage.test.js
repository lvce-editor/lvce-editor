import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusPreviousPage from '../src/parts/ViewletExtensions/ViewletExtensionsFocusPreviousPage.js'

test('focusPreviousPage - already at start', () => {
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
    ],
    focusedIndex: 0,
  }
  expect(ViewletExtensionsFocusPreviousPage.focusPreviousPage(state)).toBe(
    state
  )
})

test('focusPreviousPage - scroll up one full page', () => {
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
      {
        name: 'test extension 4',
        authorId: 'test publisher 4',
        version: '0.0.1',
        id: 'test-publisher.test-extension-4',
      },
      {
        name: 'test extension 5',
        authorId: 'test publisher 5',
        version: '0.0.1',
        id: 'test-publisher.test-extension-5',
      },
      {
        name: 'test extension 6',
        authorId: 'test publisher 6',
        version: '0.0.1',
        id: 'test-publisher.test-extension-6',
      },
    ],
    focusedIndex: 3,
    minLineY: 3,
    maxLineY: 6,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(
    ViewletExtensionsFocusPreviousPage.focusPreviousPage(state)
  ).toMatchObject({
    minLineY: 1,
    maxLineY: 4,
    focusedIndex: 1,
  })
})

test('focusPreviousPage - scroll up half a page', () => {
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
      {
        name: 'test extension 4',
        authorId: 'test publisher 4',
        version: '0.0.1',
        id: 'test-publisher.test-extension-4',
      },
      {
        name: 'test extension 5',
        authorId: 'test publisher 5',
        version: '0.0.1',
        id: 'test-publisher.test-extension-5',
      },
      {
        name: 'test extension 6',
        authorId: 'test publisher 6',
        version: '0.0.1',
        id: 'test-publisher.test-extension-6',
      },
    ],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 4,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(
    ViewletExtensionsFocusPreviousPage.focusPreviousPage(state)
  ).toMatchObject({
    minLineY: 0,
    maxLineY: 3,
    focusedIndex: 0,
  })
})
