import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as ViewletQuickPickFocusIndex from '../src/parts/ViewletQuickPick/ViewletQuickPickFocusIndex.js'

test('focusIndex - equal', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 1,
    provider: {},
  }
  expect(await ViewletQuickPickFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusIndex - scroll down', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    maxVisibleItems: 1,
    minLineY: 0,
    maxLineY: 1,
    items: [
      {
        label: '1',
      },
      {
        label: '2',
      },
    ],
  }
  expect(await ViewletQuickPickFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
  })
})
