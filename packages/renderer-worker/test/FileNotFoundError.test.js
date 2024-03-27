import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('FileNotFoundError', () => {
  const error = new FileNotFoundError('/test/not-found.txt')
  expect(error.message).toBe("File not found '/test/not-found.txt'")
  expect(error.code).toBe(ErrorCodes.ENOENT)
  expect(error.name).toBe('FileNotFoundError')
})
