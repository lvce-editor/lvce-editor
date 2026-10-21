import { expect, test } from '@jest/globals'
import { getScrollSpeed } from '../src/parts/GetScrollSpeed/GetScrollSpeed.ts'

test.each([1, 1.5, 3])('accepts scroll speed %s', (value) => {
  expect(getScrollSpeed({ 'application.scrollspeed': value })).toBe(value)
})

test.each([undefined, null, '3', 0, -1, 3.1, NaN, Infinity])('invalid scroll speed %s uses 1', (value) => {
  expect(getScrollSpeed({ 'application.scrollspeed': value })).toBe(1)
})
