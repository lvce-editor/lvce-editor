import { expect, test } from '@jest/globals'
import { isEqualUint32Array } from '../src/parts/IsEqualUint32Array/IsEqualUint32Array.js'

test('returns true for equal arrays', () => {
  expect(isEqualUint32Array(new Uint32Array([1, 2]), new Uint32Array([1, 2]))).toBe(true)
})

test('returns false for different lengths', () => {
  expect(isEqualUint32Array(new Uint32Array([1]), new Uint32Array([1, 2]))).toBe(false)
})

test('returns false for different values', () => {
  expect(isEqualUint32Array(new Uint32Array([1, 2]), new Uint32Array([1, 3]))).toBe(false)
})

test('returns false for reordered values', () => {
  expect(isEqualUint32Array(new Uint32Array([1, 2]), new Uint32Array([2, 1]))).toBe(false)
})
