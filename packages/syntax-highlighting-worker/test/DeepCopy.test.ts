import { expect, test } from '@jest/globals'
import * as DeepCopy from '../src/parts/DeepCopy/DeepCopy.ts'

test('object', () => {
  const value = {}
  expect(DeepCopy.deepCopy(value)).toEqual({})
})

test('array', () => {
  const value = []
  expect(DeepCopy.deepCopy(value)).toEqual([])
})

test('error', () => {
  const value = Symbol()
  expect(() => DeepCopy.deepCopy(value)).toThrow(new Error('Symbol() could not be cloned.'))
})
