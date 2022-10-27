import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsFocusNext from '../src/parts/ViewletExtensions/ViewletExtensionsFocusNext.js'

test('focusNext', () => {
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
  expect(ViewletExtensionsFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - already at end', () => {
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
  expect(ViewletExtensionsFocusNext.focusNext(state)).toBe(state)
})

test('focusNext - no extensions', async () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsFocusNext.focusNext(state)).toBe(state)
})
