import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as ViewletQuickPickFocusNext from '../src/parts/ViewletQuickPick/ViewletQuickPickFocusNext.js'

test('focusNext', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    items: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPickFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})
