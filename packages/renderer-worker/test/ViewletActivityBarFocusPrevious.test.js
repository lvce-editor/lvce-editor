import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocusPrevious from '../src/parts/ViewletActivityBar/ViewletActivityBarFocusPrevious.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('focusPrevious', () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 1,
  }
  expect(ViewletActivityBarFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})
