import * as EscapeRegex from '../src/parts/EscapeRegex/EscapeRegex.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('empty string', () => {
  const input = ''
  expect(EscapeRegex.escapeRegExpCharacters(input)).toBe('')
})

test('backslash', () => {
  const input = '\\'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toBe('\\\\')
})

test('curly open', () => {
  const input = '{'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\{')
})

test('curly close', () => {
  const input = '}'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\}')
})

test('star', () => {
  const input = '*'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\*')
})

test('plus', () => {
  const input = '+'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\+')
})

test('question mark', () => {
  const input = '?'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\?')
})

test('caret', () => {
  const input = '^'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\^')
})

test('dollar', () => {
  const input = '$'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\$')
})

test('dot', () => {
  const input = '.'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\.')
})

test('square open', () => {
  const input = '['
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\[')
})

test('square close', () => {
  const input = ']'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\]')
})

test('round open', () => {
  const input = '('
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\(')
})

test('round close', () => {
  const input = ')'
  expect(EscapeRegex.escapeRegExpCharacters(input)).toEqual('\\)')
})
