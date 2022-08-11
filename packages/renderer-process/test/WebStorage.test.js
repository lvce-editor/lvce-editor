/**
 * @jest-environment jsdom
 */
import * as WebStorage from '../src/parts/WebStorage/WebStorage.js'

test('getItem - localStorage', () => {
  WebStorage.setItem(WebStorage.StorageType.LocalStorage, 'sample', 'abc')
  expect(
    WebStorage.getItem(WebStorage.StorageType.LocalStorage, 'sample')
  ).toBe('abc')
})

test('getItem - localStorage - empty', () => {
  expect(
    WebStorage.getItem(WebStorage.StorageType.LocalStorage, 'non-existent')
  ).toBeUndefined()
})

test('getItem - localStorage - number should be converted to string', () => {
  WebStorage.setItem(WebStorage.StorageType.LocalStorage, 'sample', 1)
  expect(
    WebStorage.getItem(WebStorage.StorageType.LocalStorage, 'sample')
  ).toBe('1')
})

test('clear', () => {
  WebStorage.setItem(WebStorage.StorageType.LocalStorage, 'a', 'b')
  WebStorage.clear(WebStorage.StorageType.LocalStorage)
  expect(
    WebStorage.getItem(WebStorage.StorageType.LocalStorage, 'a')
  ).toBeUndefined()
})
