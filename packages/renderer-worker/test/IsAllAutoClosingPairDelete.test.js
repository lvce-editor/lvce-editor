import * as IsAllAutoClosingPairDelete from '../src/parts/IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('isAllAutoClosingPairDelete - single range', () => {
  const autoClosingRanges = [0, 1, 0, 1]
  const selections = new Uint32Array([0, 1, 0, 1])
  expect(IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)).toBe(true)
})

test('isAllAutoClosingPairDelete - non matching range', () => {
  const autoClosingRanges = [0, 1, 0, 2]
  const selections = new Uint32Array([0, 2, 0, 2])
  expect(IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)).toBe(false)
})

test('isAllAutoClosingPairDelete - two ranges', () => {
  const autoClosingRanges = [0, 1, 0, 1, 1, 1, 1, 1]
  const selections = new Uint32Array([0, 1, 0, 1, 1, 1, 1, 1])
  expect(IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)).toBe(true)
})
