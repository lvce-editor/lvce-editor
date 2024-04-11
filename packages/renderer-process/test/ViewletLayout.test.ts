/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.ts'

test('create', () => {
  const state = ViewletLayout.create()
  expect(state).toBeDefined()
})

test('accessibility - viewlet should have a role of application', () => {
  const state = ViewletLayout.create()
  const { $Viewlet } = state
  expect($Viewlet.role).toBe('application')
})
