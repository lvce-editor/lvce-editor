/**
 * @jest-environment jsdom
 */
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.js'

test('name', () => {
  expect(ViewletLayout.name).toBe('Layout')
})

test('create', () => {
  const state = ViewletLayout.create()
  expect(state).toBeDefined()
})

test('accessibility - viewlet should have a role of application', () => {
  const state = ViewletLayout.create()
  const { $Viewlet } = state
  // @ts-ignore
  expect($Viewlet.role).toBe('application')
})
