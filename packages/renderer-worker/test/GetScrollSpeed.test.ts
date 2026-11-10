import { expect, test } from '@jest/globals'
import { getScrollSpeed } from '../src/parts/GetScrollSpeed/GetScrollSpeed.ts'

test.each([1, 1.5, 3, 10])('accepts general scroll speed %s', (value) => {
  expect(getScrollSpeed({ 'application.scrollspeed': value }, 'chromium')).toBe(value)
})

test.each([undefined, null, '3', 0, -1, 10.1, NaN, Infinity])('invalid general scroll speed %s uses 1', (value) => {
  expect(getScrollSpeed({ 'application.scrollspeed': value }, 'chromium')).toBe(1)
})

test.each([1, 1.5, 5, 10])('accepts Firefox scroll speed %s', (value) => {
  expect(getScrollSpeed({ 'application.scrollspeed': 3, 'application.scrollspeed.firefox': value }, 'firefox')).toBe(value)
})

test.each([undefined, null, '5', 0, -1, 10.1, NaN, Infinity])('invalid Firefox scroll speed %s uses 5', (value) => {
  expect(getScrollSpeed({ 'application.scrollspeed': 3, 'application.scrollspeed.firefox': value }, 'firefox')).toBe(5)
})

test('uses Firefox default when no browser-specific preference is present', () => {
  expect(getScrollSpeed({ 'application.scrollspeed': 3 }, 'firefox')).toBe(5)
})

test('keeps the global setting for Chromium when Firefox override is set', () => {
  expect(getScrollSpeed({ 'application.scrollspeed': 2, 'application.scrollspeed.firefox': 5 }, 'chromium')).toBe(2)
})
