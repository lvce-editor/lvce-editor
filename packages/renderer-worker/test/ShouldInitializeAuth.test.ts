import { expect, test } from '@jest/globals'
import { shouldInitializeAuth } from '../src/parts/ShouldInitializeAuth/ShouldInitializeAuth.ts'

test('does not initialize auth during ordinary startup', () => {
  expect(shouldInitializeAuth(false, false, false)).toBe(false)
})

test('initializes auth for an auth callback', () => {
  expect(shouldInitializeAuth(true, false, false)).toBe(true)
})

test('initializes auth in prompt mode', () => {
  expect(shouldInitializeAuth(false, true, false)).toBe(true)
})

test('initializes auth during browser startup to restore persisted sessions and pending callbacks', () => {
  expect(shouldInitializeAuth(false, false, true)).toBe(true)
})
