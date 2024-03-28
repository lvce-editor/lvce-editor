import { expect, test } from '@jest/globals'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

test('FileNotFoundError - empty string', () => {
  const error = new FileNotFoundError(``)
  // @ts-ignore
  expect(error.message).toBe(`File not found: '<empty string>'`)
})
