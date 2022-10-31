/**
 * @jest-environment jsdom
 */
import * as ViewletNotification from '../src/parts/ViewletNotification/ViewletNotification.js'

// TODO test dispose
test('create', () => {
  const state = ViewletNotification.create()
  expect(state).toBeDefined()
})

test('setText', () => {
  const state = ViewletNotification.create()
  ViewletNotification.setText(state, 'test info')
  const { $Viewlet } = state
  expect($Viewlet.textContent).toBe('test info')
})
