import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'

// TODO the message payload was more efficient before: 831,1

test('focusIndex', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 0,
  }
  expect(ViewletEditorCompletion.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusFirst', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 2,
  }
  expect(ViewletEditorCompletion.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusLast', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 0,
  }
  expect(ViewletEditorCompletion.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 1,
  }
  expect(ViewletEditorCompletion.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 0,
  }
  expect(ViewletEditorCompletion.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusNext', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 1,
  }
  expect(ViewletEditorCompletion.focusNext(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusNext - at end', () => {
  const state = {
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 2,
  }
  expect(ViewletEditorCompletion.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})
