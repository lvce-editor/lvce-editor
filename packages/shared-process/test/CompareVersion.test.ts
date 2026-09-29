import { expect, test } from '@jest/globals'
import * as CompareVersion from '../src/parts/CompareVersion/CompareVersion.ts'

test('returns false when versions match', () => {
  expect(CompareVersion.isGreater('0.112.27', '0.112.27')).toBe(false)
})

test('returns true when the version is newer', () => {
  expect(CompareVersion.isGreater('0.112.28', '0.112.27')).toBe(true)
  expect(CompareVersion.isGreater('0.113.0', '0.112.27')).toBe(true)
  expect(CompareVersion.isGreater('1.0.0', '0.112.27')).toBe(true)
})

test('returns false when the version is older', () => {
  expect(CompareVersion.isGreater('0.112.26', '0.112.27')).toBe(false)
  expect(CompareVersion.isGreater('0.111.99', '0.112.27')).toBe(false)
  expect(CompareVersion.isGreater('0.99.99', '1.0.0')).toBe(false)
})
