import * as ViewletList from '../src/parts/ViewletList/ViewletList.js'

test('create', () => {
  const state = ViewletList.create()
  expect(state).toBeDefined()
})

test('focusFirst', async () => {
  const state = {
    ...ViewletList.create(),
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
  expect(ViewletList.focusFirst(state)).toMatchObject({ focusedIndex: 0 })
})

test('focusFirst - no items', () => {
  const state = ViewletList.create()
  expect(ViewletList.focusFirst(state)).toBe(state)
})

test('focusLast', () => {
  const state = {
    ...ViewletList.create(),
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
    focusedIndex: 0,
  }
  expect(ViewletList.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no items', () => {
  const state = ViewletList.create()
  expect(ViewletList.focusLast(state)).toBe(state)
})

test('focusNext', () => {
  const state = {
    ...ViewletList.create(),
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
    focusedIndex: 0,
  }
  expect(ViewletList.focusNext(state)).toMatchObject({ focusedIndex: 1 })
})

test('focusNext - already at end', () => {
  const state = {
    ...ViewletList.create(),
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
  expect(ViewletList.focusNext(state)).toBe(state)
})

test('focusNextPage - scroll down one full page', () => {
  const state = {
    ...ViewletList.create(),
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
    height: ViewletList.ITEM_HEIGHT * 3,
  }
  expect(ViewletList.focusNextPage(state)).toMatchObject({
    minLineY: 2,
    maxLineY: 5,
    focusedIndex: 4,
  })
})

test('focusNextPage - scroll down half a page', () => {
  const state = {
    ...ViewletList.create(),
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
    height: ViewletList.ITEM_HEIGHT * 3,
  }
  expect(ViewletList.focusNextPage(state)).toMatchObject({
    minLineY: 3,
    maxLineY: 6,
    focusedIndex: 5,
  })
})

test('focusNextPage - already at end', () => {
  const state = {
    ...ViewletList.create(),
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
  expect(ViewletList.focusNextPage(state)).toBe(state)
})

test('focusNext - no items', async () => {
  const state = ViewletList.create()
  expect(ViewletList.focusNext(state)).toBe(state)
})

test('focusPrevious', () => {
  const state = {
    ...ViewletList.create(),
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
  expect(ViewletList.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - already at start', () => {
  const state = {
    ...ViewletList.create(),
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
    focusedIndex: 0,
  }
  expect(ViewletList.focusPrevious(state)).toBe(state)
})

test('focusPrevious - no items', () => {
  const state = ViewletList.create()
  expect(ViewletList.focusPrevious(state)).toBe(state)
})

test('focusPreviousPage - already at start', () => {
  const state = {
    ...ViewletList.create(),
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
    focusedIndex: 0,
  }
  expect(ViewletList.focusPreviousPage(state)).toBe(state)
})

test('focusPreviousPage - scroll up one full page', () => {
  const state = {
    ...ViewletList.create(),
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
    focusedIndex: 3,
    minLineY: 3,
    maxLineY: 6,
    height: ViewletList.ITEM_HEIGHT * 3,
  }
  expect(ViewletList.focusPreviousPage(state)).toMatchObject({
    minLineY: 1,
    maxLineY: 4,
    focusedIndex: 1,
  })
})

test('focusPreviousPage - scroll up half a page', () => {
  const state = {
    ...ViewletList.create(),
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
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 4,
    height: ViewletList.ITEM_HEIGHT * 3,
  }
  expect(ViewletList.focusPreviousPage(state)).toMatchObject({
    minLineY: 0,
    maxLineY: 3,
    focusedIndex: 0,
  })
})

test('handleWheel - scroll down', () => {
  const state = {
    ...ViewletList.create(),
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
    ],
    height: 124,
    deltaY: 0,
  }
  expect(ViewletList.handleWheel(state, 62)).toMatchObject({
    minLineY: 1,
    deltaY: 62,
  })
})

test('handleWheel - scroll up', () => {
  const state = {
    ...ViewletList.create(),
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
    ],
    height: 124,
    deltaY: 62,
  }
  expect(ViewletList.handleWheel(state, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})
