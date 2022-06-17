import * as Base64 from '../src/parts/Base64/Base64.js'

test('decode', () => {
  expect(Base64.decode('YWJj')).toBe('abc')
})
