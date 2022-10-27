import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusNextPage from '../src/parts/ViewletExtensions/ViewletExtensionsFocusNextPage.js'

test('focusNextPage - scroll down one full page', () => {
  const state = {
    ...ViewletExtensions.create(),
    items: [
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
    minLineY: 0,
    maxLineY: 3,
    focusedIndex: 0,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(ViewletExtensionsFocusNextPage.focusNextPage(state)).toMatchObject({
    minLineY: 2,
    maxLineY: 5,
    focusedIndex: 4,
  })
})

test('focusNextPage - scroll down half a page', () => {
  const state = {
    ...ViewletExtensions.create(),
    items: [
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
    minLineY: 3,
    maxLineY: 6,
    focusedIndex: 4,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(ViewletExtensionsFocusNextPage.focusNextPage(state)).toMatchObject({
    minLineY: 3,
    maxLineY: 6,
    focusedIndex: 5,
  })
})

test('focusNextPage - already at end', () => {
  const state = {
    ...ViewletExtensions.create(),
    items: [
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
    minLineY: 1,
    maxLineY: 2,
    focusedIndex: 1,
  }
  expect(ViewletExtensionsFocusNextPage.focusNextPage(state)).toBe(state)
})
