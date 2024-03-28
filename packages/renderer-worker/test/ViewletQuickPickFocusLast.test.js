import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as ViewletQuickPickFocusLast from '../src/parts/ViewletQuickPick/ViewletQuickPickFocusLast.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
