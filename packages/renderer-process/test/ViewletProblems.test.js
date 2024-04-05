/**
 * @jest-environment jsdom
 */

import { expect, test } from '@jest/globals'
import * as ViewletProblems from '../src/parts/ViewletProblems/ViewletProblems.ts'

test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('focus', () => {
  const state = ViewletProblems.create()
  document.body.append(state.$Viewlet)
  ViewletProblems.focus(state)
  expect(document.activeElement).toBe(state.$Viewlet)
})

test('setFocusedIndex', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setFocusedIndex(state, -1)
  expect(state.$Viewlet.classList.contains('FocusOutline')).toBe(true)
})
