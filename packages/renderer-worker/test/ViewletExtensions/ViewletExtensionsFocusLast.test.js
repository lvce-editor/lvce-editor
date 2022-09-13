import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusLast from '../src/parts/ViewletExtensions/ViewletExtensionsFocusLast.js'

test('focusLast', () => {
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
  expect(ViewletExtensionsFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no extensions', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsFocusLast.focusLast(state)).toBe(state)
})
