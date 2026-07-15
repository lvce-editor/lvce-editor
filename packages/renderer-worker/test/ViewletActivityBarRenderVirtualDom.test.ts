import { expect, test } from '@jest/globals'
import * as ViewletActivityBarRenderVirtualDom from '../src/parts/ViewletActivityBar/ViewletActivityBarRenderVirtualDom.js'

test('supports functional resize commands', () => {
  expect(ViewletActivityBarRenderVirtualDom.hasFunctionalResize).toBe(true)
})
