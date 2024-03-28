import * as IsBabelParseError from '../src/parts/IsBabelParseError/IsBabelParseError.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('isBabelParseError - type error', () => {
  const error = new TypeError('x is not a function')
  expect(IsBabelParseError.isBabelError(error)).toBe(false)
})
