/**
 * @jest-environment jsdom
 */
import * as SessionStorage from '../src/parts/SessionStorage/SessionStorage.js'

test('getItem', () => {
  SessionStorage.setItem('sample', 'abc')
  expect(SessionStorage.getItem('sample')).toBe('abc')
})

test('getItem - empty', () => {
  expect(SessionStorage.getItem('non-existent')).toBeUndefined()
})

test('getItem - number should get converted to string', () => {
  SessionStorage.setItem('sample', 1)
  expect(SessionStorage.getItem('sample')).toBe('1')
})

test('clear', () => {
  SessionStorage.setItem('a', 'b')
  SessionStorage.clear()
  expect(SessionStorage.getItem('a')).toBeUndefined()
})
