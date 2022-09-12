import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as ViewletQuickPickFocusLast from '../src/parts/ViewletQuickPick/ViewletQuickPickFocusLast.js'

test('focusLast', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    items: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPickFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})
