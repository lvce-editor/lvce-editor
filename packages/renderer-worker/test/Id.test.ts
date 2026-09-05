import { beforeEach, expect, test } from '@jest/globals'
import * as Id from '../src/parts/Id/Id.js'

beforeEach(() => {
  Id.state.id = 0
})

test('generate', () => {
  expect(Id.create()).toBe(1)
  expect(Id.create()).toBe(2)
})

test('worker ranges do not collide with renderer ids or later ranges', () => {
  expect(Id.create()).toBe(1)
  expect(Id.reserve(2 ** 32)).toEqual({ start: 2, end: 2 ** 32 + 1 })
  expect(Id.create()).toBe(2 ** 32 + 2)
  expect(Id.reserve(10)).toEqual({ start: 2 ** 32 + 3, end: 2 ** 32 + 12 })
})

test.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('invalid range size %s does not consume ids', (count) => {
  expect(() => Id.reserve(count)).toThrow('Invalid or exhausted')
  expect(Id.create()).toBe(1)
})

test('exhaustion never wraps or returns unsafe ids', () => {
  expect(Id.reserve(Number.MAX_SAFE_INTEGER).end).toBe(Number.MAX_SAFE_INTEGER)
  expect(() => Id.create()).toThrow('Invalid or exhausted')
  expect(() => Id.reserve(2)).toThrow('Invalid or exhausted')
})
