/**
 * @jest-environment jsdom
 */
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.js'

test('create', () => {
  const state = ViewletLayout.create()
  expect(state).toBeDefined()
})

test('accessibility - viewlet should have a role of application', () => {
  const state = ViewletLayout.create()
  const { $Viewlet } = state
  expect($Viewlet.role).toBe('application')
})
