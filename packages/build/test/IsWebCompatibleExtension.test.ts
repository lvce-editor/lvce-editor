import { expect, test } from '@jest/globals'
import { isWebCompatibleExtension } from '../src/parts/IsWebCompatibleExtension/IsWebCompatibleExtension.ts'

test('returns true when web compatibility is not specified', () => {
  expect(isWebCompatibleExtension({})).toBe(true)
})

test('returns true when an extension is web compatible', () => {
  expect(isWebCompatibleExtension({ compatibility: { web: true } })).toBe(true)
})

test('returns false when an extension is not web compatible', () => {
  expect(isWebCompatibleExtension({ compatibility: { web: false } })).toBe(false)
})
