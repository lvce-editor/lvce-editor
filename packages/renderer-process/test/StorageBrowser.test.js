/**
 * @jest-environment jsdom
 */
import * as StorageBrowser from '../src/parts/StorageBrowser/StorageBrowser.js'

test('getItem - localStorage', () => {
  StorageBrowser.setItem('sample', 'abc')
  expect(StorageBrowser.getItem(/* localStorage */ 1, /* key */ 'sample')).toBe(
    'abc'
  )
})

test('getItem - localStorage - empty', () => {
  expect(
    StorageBrowser.getItem(/* localStorage */ 1, /* key */ 'non-existent')
  ).toBeUndefined()
})

test('getItem - localStorage - number should be converted to string', () => {
  StorageBrowser.setItem(
    /* localStorage */ 1,
    /* key */ 'sample',
    /* value */ 1
  )
  expect(StorageBrowser.getItem(/* localStorage */ 1, /* key */ 'sample')).toBe(
    '1'
  )
})

test('clear', () => {
  StorageBrowser.setItem(/* localStorage */ 1, /* key */ 'a', /* value */ 'b')
  StorageBrowser.clear(/* localStorage */ 1)
  expect(
    StorageBrowser.getItem(/* localStorage */ 1, /* key */ 'a')
  ).toBeUndefined()
})
