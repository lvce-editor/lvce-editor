import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletActivityBarFocus from '../src/parts/ViewletActivityBar/ViewletActivityBarFocus.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('focus', () => {
  const state = ViewletActivityBar.create()
  expect(ViewletActivityBarFocus.focus(state)).toMatchObject({
    focusedIndex: 0,
  })
})
