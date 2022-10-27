import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusFirst from '../src/parts/ViewletExtensions/ViewletExtensionsFocusFirst.js'

test('focusFirst', () => {
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
    focusedIndex: 1,
  }
  expect(ViewletExtensionsFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no extensions', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsFocusFirst.focusFirst(state)).toBe(state)
})
