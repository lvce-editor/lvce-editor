import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as ViewletQuickPickFocusPrevious from '../src/parts/ViewletQuickPick/ViewletQuickPickFocusPrevious.js'

test('focusPrevious', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 2,
    provider: {},
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(
    await ViewletQuickPickFocusPrevious.focusPrevious(state)
  ).toMatchObject({
    focusedIndex: 1,
  })
})
