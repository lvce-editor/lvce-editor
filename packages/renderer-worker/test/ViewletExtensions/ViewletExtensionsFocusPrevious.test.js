import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusPrevious from '../src/parts/ViewletExtensions/ViewletExtensionsFocusPrevious.js'

test('focusPrevious', () => {
  const state = {
    ...ViewletExtensions.create(),
    extensions: [
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
    focusedIndex: 1,
  }
  expect(ViewletExtensionsFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - already at start', () => {
  const state = {
    ...ViewletExtensions.create(),
    extensions: [
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
  expect(ViewletExtensionsFocusPrevious.focusPrevious(state)).toBe(state)
})

test('focusPrevious - no extensions', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsFocusPrevious.focusPrevious(state)).toBe(state)
})
