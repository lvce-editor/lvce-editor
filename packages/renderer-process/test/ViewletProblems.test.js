/**
 * @jest-environment jsdom
 */

import * as ViewletProblems from '../src/parts/ViewletProblems/ViewletProblems.js'

const getSimpleList = (state) => {
  return Array.from(state.element.children).map((node) => node.textContent)
}

test('name', () => {
  expect(ViewletProblems.name).toBe('Problems')
})

test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('refresh - no problems', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setProblems(state, [])
  expect(state.$Viewlet.textContent).toBe(
    'No problems have been detected in the workspace.'
  )
})

test('refresh - multiple problems', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setProblems(state, ['Problem 1', 'Problem 2'])
  expect(state.$Viewlet.textContent).toBe(
    `Problem 1
Problem 2`
  )
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

// test('append', () => {
//   const state = ViewletProblems.create()
//   ViewletProblems.append(state, 'line 1')
//   expect(getSimpleList(state)).toEqual(['line 1'])
//   ViewletProblems.append(state, 'line 2')
//   expect(getSimpleList(state)).toEqual(['line 1', 'line 2'])
// })

// test('clear', () => {
//   const state = ViewletProblems.create()
//   ViewletProblems.clear(state)
//   expect(getSimpleList(state)).toEqual([])
// })

// test('handleError', () => {
//   const state = ViewletProblems.create()
//   ViewletProblems.handleError(state, 'test error')
//   expect(state.element.textContent).toBe('Error: test error')
// })
