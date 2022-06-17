/**
 * @jest-environment jsdom
 */
import * as LocalStorage from '../src/parts/LocalStorage/LocalStorage.js'

test('getItem', () => {
  LocalStorage.setItem('sample', 'abc')
  expect(LocalStorage.getItem('sample')).toBe('abc')
})

test('getItem - empty', () => {
  expect(LocalStorage.getItem('non-existent')).toBeUndefined()
})

test('getItem - number should be converted to string', () => {
  LocalStorage.setItem('sample', 1)
  expect(LocalStorage.getItem('sample')).toBe('1')
})

test('clear', () => {
  LocalStorage.setItem('a', 'b')
  LocalStorage.clear()
  expect(LocalStorage.getItem('a')).toBeUndefined()
})
