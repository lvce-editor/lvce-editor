import { expect, test } from '@jest/globals'
import * as FindMatchesCaseInsensitive from '../src/parts/FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.js'

test('findMatchesCaseInsensitive - no results', () => {
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive([], '')).toEqual(new Uint32Array([]))
})

test('findMatchesCaseInsensitive - empty string', () => {
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(['abc'], '')).toEqual(new Uint32Array([]))
})

test('findMatchesCaseInsensitive - one result', () => {
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(['line 1'], 'line')).toEqual(new Uint32Array([0, 0]))
})

test('findMatchesCaseInsensitive - one result - different case', () => {
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(['line 1'], 'Line')).toEqual(new Uint32Array([0, 0]))
})

test('findMatchesCaseInsensitive - two results in two rows', () => {
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(['line 1', 'not match', 'line 3'], 'line')).toEqual(new Uint32Array([0, 0, 2, 0]))
})

test('findMatchesCaseInsensitive - two results in one row', () => {
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(['line 1 line 2'], 'line')).toEqual(new Uint32Array([0, 0, 0, 7]))
})
