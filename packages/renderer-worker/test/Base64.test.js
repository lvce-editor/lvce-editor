import * as Base64 from '../src/parts/Base64/Base64.js'

test('decode', async () => {
  expect(await Base64.decode('YWJj')).toBe('abc')
})
