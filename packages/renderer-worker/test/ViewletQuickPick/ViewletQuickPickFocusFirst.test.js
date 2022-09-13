import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as ViewletQuickPickFocusFirst from '../src/parts/ViewletQuickPick/ViewletQuickPickFocusFirst.js'

test('focusFirst', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 3,
    provider: {},
  }
  expect(await ViewletQuickPickFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})
