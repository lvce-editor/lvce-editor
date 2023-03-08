import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

test('FileNotFoundError - empty string', () => {
  const error = new FileNotFoundError(``)
  expect(error.message).toBe(`File not found: '<empty string>'`)
})
