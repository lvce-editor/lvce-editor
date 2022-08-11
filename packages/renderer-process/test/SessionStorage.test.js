/**
 * @jest-environment jsdom
 */
import * as StorageSession from '../src/parts/StorageSession/StorageSession.js'

test('getItem', () => {
  StorageSession.setItem('sample', 'abc')
  expect(StorageSession.getItem('sample')).toBe('abc')
})

test('getItem - empty', () => {
  expect(StorageSession.getItem('non-existent')).toBeUndefined()
})

test('getItem - number should get converted to string', () => {
  StorageSession.setItem('sample', 1)
  expect(StorageSession.getItem('sample')).toBe('1')
})

test('clear', () => {
  StorageSession.setItem('a', 'b')
  StorageSession.clear()
  expect(StorageSession.getItem('a')).toBeUndefined()
})
