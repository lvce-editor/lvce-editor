import { expect, test } from '@jest/globals'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocusFirst from '../src/parts/ViewletActivityBar/ViewletActivityBarFocusFirst.js'

test('focusFirst', async () => {
  const state = {
    // @ts-ignore
    ...ViewletActivityBar.create(),
    focusedIndex: 2,
  }
  expect(ViewletActivityBarFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})
