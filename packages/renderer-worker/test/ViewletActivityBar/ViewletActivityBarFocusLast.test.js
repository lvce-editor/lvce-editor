import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocusNext from '../src/parts/ViewletActivityBar/ViewletActivityBarFocusNext.js'

test('focusNext', () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 0,
  }
  expect(ViewletActivityBarFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})
