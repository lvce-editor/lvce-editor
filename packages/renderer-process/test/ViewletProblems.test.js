/**
 * @jest-environment jsdom
 */

import * as ViewletProblems from '../src/parts/ViewletProblems/ViewletProblems.js'

test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('setMessage', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setMessage(state, 'abc')
  const { $Viewlet } = state
  expect($Viewlet.textContent).toBe('abc')
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
