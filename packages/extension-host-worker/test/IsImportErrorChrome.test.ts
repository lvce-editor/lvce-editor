import { expect, test } from '@jest/globals'
import * as IsImportErrorChrome from '../src/parts/IsImportErrorChrome/IsImportErrorChrome.ts'

test('isImportErrorChrome', () => {
  const error = new Error('Failed to fetch dynamically imported module')
  expect(IsImportErrorChrome.isImportErrorChrome(error)).toBe(true)
})

test('isImportErrorChrome - other error', () => {
  const error = new TypeError('x is not a function')
  expect(IsImportErrorChrome.isImportErrorChrome(error)).toBe(false)
})
