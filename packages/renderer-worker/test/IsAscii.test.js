import * as IsAscii from '../src/parts/IsAscii/IsAscii.js'

test('ascii letter', () => {
  expect(IsAscii.isAscii('a')).toBe(true)
})

test('multiple ascii letters', () => {
  expect(IsAscii.isAscii('abc')).toBe(true)
})

test('emoji', () => {
  expect(IsAscii.isAscii('👮🏽‍♀️')).toBe(false)
})
