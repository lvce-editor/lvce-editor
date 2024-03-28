import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocusNext from '../src/parts/ViewletActivityBar/ViewletActivityBarFocusNext.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('focusNext', () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 0,
  }
  expect(ViewletActivityBarFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})
