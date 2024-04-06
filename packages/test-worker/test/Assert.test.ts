import { test, expect } from '@jest/globals'
import * as Assert from '../src/parts/Assert/Assert.ts'

test('object - error', () => {
  expect(Assert.object({})).toBeUndefined()
})

test('object - error', () => {
  expect(() => {
    Assert.object('')
  }).toThrow(new Error('expected value to be of type object'))
})

test('number', () => {
  expect(Assert.number(1)).toBeUndefined()
})

test('number - error', () => {
  expect(() => {
    Assert.number('')
  }).toThrow(new Error('expected value to be of type number'))
})

test('array', () => {
  expect(Assert.array([])).toBeUndefined()
})

test('array - error', () => {
  expect(() => {
    Assert.array('')
  }).toThrow(new Error('expected value to be of type array'))
})

test('fn', () => {
  expect(Assert.fn(() => {})).toBeUndefined()
})

test('fn - error', () => {
  expect(() => {
    Assert.fn('')
  }).toThrow(new Error('expected value to be of type function'))
})

test('uint32array', () => {
  expect(Assert.uint32array(new Uint32Array([]))).toBeUndefined()
})

test('uint32array - error', () => {
  expect(() => {
    Assert.uint32array('')
  }).toThrow(new Error('expected value to be of type uint32array'))
})

test('string', () => {
  expect(Assert.string('')).toBeUndefined()
})

test('string - error', () => {
  expect(() => {
    Assert.string(1)
  }).toThrow(new Error('expected value to be of type string'))
})

test('null_', () => {
  expect(Assert.null_(null)).toBeUndefined()
})

test('null_ - error', () => {
  expect(() => {
    Assert.null_(1)
  }).toThrow(new Error('expected value to be of type null'))
})

test('boolean', () => {
  expect(Assert.boolean(true)).toBeUndefined()
})

test('boolean - error', () => {
  expect(() => {
    Assert.boolean(1)
  }).toThrow(new Error('expected value to be of type boolean'))
})
