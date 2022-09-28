import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleTouchStart from '../src/parts/ViewletExtensions/ViewletExtensionsHandleTouchStart.js'

test('handleTouchStart - empty changed touches array', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsHandleTouchStart.handleTouchStart(state, 0, [])).toBe(
    state
  )
})
