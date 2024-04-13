import { expect, test } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.js'

test('isWindows', () => {
  expect(Platform.isWindows).toEqual(expect.any(Boolean))
})

test('isMacOs', () => {
  expect(Platform.isMacOs).toEqual(expect.any(Boolean))
})

test('getPathSeparator', () => {
  expect(Platform.getPathSeparator()).toEqual(expect.any(String))
})
