import { expect, test } from '@jest/globals'
import * as Assert from '../src/parts/Assert/Assert.ts'

test('object', () => {
  expect(() => Assert.object('')).toThrow(new Error('expected value to be of type object'))
})

test('number', () => {
  expect(() => Assert.number('')).toThrow(new Error('expected value to be of type number'))
})

test('array', () => {
  expect(() => Assert.array('')).toThrow(new Error('expected value to be of type array'))
})

test('string', () => {
  expect(() => Assert.string(1)).toThrow(new Error('expected value to be of type string'))
})

test('boolean', () => {
  expect(() => Assert.boolean(1)).toThrow(new Error('expected value to be of type boolean'))
})
