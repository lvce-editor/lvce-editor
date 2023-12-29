/**
 * @jest-environment jsdom
 */
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.js'

test('create', () => {
  const state = ViewletSourceControl.create()
  expect(state).toBeDefined()
})

test.skip('focus', () => {
  const state = ViewletSourceControl.create()
  Viewlet.mount(document.body, state)
  ViewletSourceControl.focus(state)
  expect(document.activeElement).toBe(state.$ViewSourceControlInput)
})
