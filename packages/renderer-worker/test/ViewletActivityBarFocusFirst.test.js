import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocusFirst from '../src/parts/ViewletActivityBar/ViewletActivityBarFocusFirst.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('focusFirst', async () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 2,
  }
  expect(ViewletActivityBarFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})
