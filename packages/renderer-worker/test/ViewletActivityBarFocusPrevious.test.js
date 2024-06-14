import { expect, test } from '@jest/globals'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocusPrevious from '../src/parts/ViewletActivityBar/ViewletActivityBarFocusPrevious.js'

test('focusPrevious', () => {
  const state = {
    // @ts-ignore
    ...ViewletActivityBar.create(),
    focusedIndex: 1,
  }
  expect(ViewletActivityBarFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})
