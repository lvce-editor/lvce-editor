import { test, expect } from '@jest/globals'
import * as GetKeyOptions from '../src/parts/GetKeyOptions/GetKeyOptions.ts'

test('key with control', () => {
  expect(GetKeyOptions.getKeyOptions('Control+a')).toEqual({
    key: 'a',
    ctrlKey: true,
    altKey: false,
  })
})

test('key with alt', () => {
  expect(GetKeyOptions.getKeyOptions('Alt+a')).toEqual({
    key: 'a',
    ctrlKey: false,
    altKey: true,
  })
})

test('key with space', () => {
  expect(GetKeyOptions.getKeyOptions('Control+Space')).toEqual({
    key: ' ',
    ctrlKey: true,
    altKey: false,
  })
})

test('normal key', () => {
  expect(GetKeyOptions.getKeyOptions('a')).toEqual({
    key: 'a',
    ctrlKey: false,
    altKey: false,
  })
})
