/**
 * @jest-environment jsdom
 */
import * as EditorError from '../src/parts/EditorError/EditorError.js'

test('create', () => {
  const state = EditorError.create('no definition found', 10, 20)
  const $EditorError = state.$EditorError
  expect($EditorError).toBeDefined()
  expect($EditorError.isConnected).toBe(true)
  expect($EditorError.style.left).toBe('10px')
  expect($EditorError.style.top).toBe('20px')
})

test('dispose', () => {
  const state = EditorError.create('no definition found', 10, 20)
  EditorError.dispose(state)
})

// test('accessibility - error should have role of alert', () => {
//   EditorError.show('no definition found', 10, 20)
//   const $EditorError = EditorError.state.$EditorError
//   expect($EditorError).toBeDefined()
//   expect($EditorError.getAttribute('role')).toBe('alert')
//   expect($EditorError.getAttribute('aria-live')).toBe('polite')
//   expect($EditorError.getAttribute('aria-atomic')).toBe('true')
// })
