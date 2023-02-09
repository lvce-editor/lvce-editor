import * as IsAscii from '../src/parts/IsAscii/IsAscii.js'

test('lowercase ascii letter', () => {
  expect(IsAscii.isAscii('a')).toBe(true)
})

test('uppercase ascii letter', () => {
  expect(IsAscii.isAscii('A')).toBe(true)
})

test('multiple ascii letters', () => {
  expect(IsAscii.isAscii('abc')).toBe(true)
})

test('emoji', () => {
  expect(IsAscii.isAscii('👮🏽‍♀️')).toBe(false)
})

test('colon', () => {
  expect(IsAscii.isAscii(':')).toBe(true)
})

test('semicolon', () => {
  expect(IsAscii.isAscii(';')).toBe(true)
})
