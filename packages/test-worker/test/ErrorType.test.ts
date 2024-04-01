import { expect, test } from '@jest/globals'
import * as ErrorType from '../src/parts/ErrorType/ErrorType.ts'

test('DomException', () => {
  expect(ErrorType.DomException).toBe('DOMException')
})

test('ReferenceError', () => {
  expect(ErrorType.ReferenceError).toBe('ReferenceError')
})

test('SyntaxError', () => {
  expect(ErrorType.SyntaxError).toBe('SyntaxError')
})

test('TypeError', () => {
  expect(ErrorType.TypeError).toBe('TypeError')
})
