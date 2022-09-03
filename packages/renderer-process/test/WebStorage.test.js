/**
 * @jest-environment jsdom
 */
import * as WebStorage from '../src/parts/WebStorage/WebStorage.js'
import * as WebStorageType from '../src/parts/WebStorageType/WebStorageType.js'

test('getItem - localStorage', () => {
  WebStorage.setItem(WebStorageType.LocalStorage, 'sample', 'abc')
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'sample')).toBe('abc')
})

test('getItem - localStorage - empty', () => {
  expect(
    WebStorage.getItem(WebStorageType.LocalStorage, 'non-existent')
  ).toBeUndefined()
})

test('getItem - localStorage - number should be converted to string', () => {
  WebStorage.setItem(WebStorageType.LocalStorage, 'sample', 1)
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'sample')).toBe('1')
})

test('clear', () => {
  WebStorage.setItem(WebStorageType.LocalStorage, 'a', 'b')
  WebStorage.clear(WebStorageType.LocalStorage)
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'a')).toBeUndefined()
})
