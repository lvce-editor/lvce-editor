import * as FindMatches from '../src/parts/FindMatches/FindMatches.js'
import * as FindPreviousMatch from '../src/parts/FindPreviousMatch/FindPreviousMatch.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('findMatches - no results', () => {
  expect(FindMatches.findMatches([], '')).toEqual(new Uint32Array([]))
})

test('findMatches - empty string', () => {
  expect(FindMatches.findMatches(['abc'], '')).toEqual(new Uint32Array([]))
})

test('findMatches - one result', () => {
  expect(FindMatches.findMatches(['line 1'], 'line')).toEqual(new Uint32Array([0, 0]))
})

test('findMatches - two results in two rows', () => {
  expect(FindMatches.findMatches(['line 1', 'not match', 'line 3'], 'line')).toEqual(new Uint32Array([0, 0, 2, 0]))
})

test('findMatches - two results in one row', () => {
  expect(FindMatches.findMatches(['line 1 line 2'], 'line')).toEqual(new Uint32Array([0, 0, 0, 7]))
})

test('findPreviousMatch', () => {
  expect(FindPreviousMatch.findPreviousMatch(['line 1', 'not match', 'line 3'], 2)).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
