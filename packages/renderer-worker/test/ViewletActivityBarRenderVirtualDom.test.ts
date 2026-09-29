import { expect, test } from '@jest/globals'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.ipc.ts'

test('supports functional resize commands', () => {
  expect(ViewletActivityBar.hasFunctionalResize).toBe(true)
})
