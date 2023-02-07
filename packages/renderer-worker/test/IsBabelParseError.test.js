import * as IsBabelParseError from '../src/parts/IsBabelParseError/IsBabelParseError.js'

test('isBabelParseError - type error', () => {
  const error = new TypeError('x is not a function')
  expect(IsBabelParseError.isBabelError(error)).toBe(false)
})
