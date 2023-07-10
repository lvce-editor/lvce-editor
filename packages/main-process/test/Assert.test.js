const Assert = require('../src/parts/Assert/Assert.js')

test('object', () => {
  expect(() => Assert.object('')).toThrowError(
    new Error('expected value to be of type object')
  )
})

test('number', () => {
  expect(() => Assert.number('')).toThrowError(
    new Error('expected value to be of type number')
  )
})

test('array', () => {
  expect(() => Assert.array('')).toThrowError(
    new Error('expected value to be of type array')
  )
})

test('string', () => {
  expect(() => Assert.string(1)).toThrowError(
    new Error('expected value to be of type string')
  )
})

test('boolean', () => {
  expect(() => Assert.boolean(1)).toThrowError(
    new Error('expected value to be of type boolean')
  )
})
