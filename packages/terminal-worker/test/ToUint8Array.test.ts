import * as ToUint8Array from '../src/parts/ToUint8Array/ToUint8Array.ts'
import { test, expect } from '@jest/globals'

test('uint8Array', () => {
  const data = new Uint8Array([])
  expect(ToUint8Array.toUint8Array(data)).toBe(data)
})

test('string', () => {
  const data = 'a'
  expect(ToUint8Array.toUint8Array(data)).toEqual(new Uint8Array([97]))
})

test('object', () => {
  const data = {
    type: 'buffer',
    data: [1],
  }
  expect(ToUint8Array.toUint8Array(data)).toEqual(new Uint8Array([1]))
})

test('invalid', () => {
  const data = 123
  expect(() => ToUint8Array.toUint8Array(data)).toThrow(new Error('unexpected data type'))
})
