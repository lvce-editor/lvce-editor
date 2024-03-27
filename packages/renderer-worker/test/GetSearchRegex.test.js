import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as GetSearchRegex from '../src/parts/GetSearchRegex/GetSearchRegex.js'

test('empty string', () => {
  const input = ''
  expect(GetSearchRegex.getSearchRegex(input)).toEqual(/(?:)/gi)
})

test('character', () => {
  const input = 'a'
  expect(GetSearchRegex.getSearchRegex(input)).toEqual(/a/gi)
})

test('escape - backslash', () => {
  const input = '\\'
  expect(GetSearchRegex.getSearchRegex(input)).toEqual(/\\/gi)
})
