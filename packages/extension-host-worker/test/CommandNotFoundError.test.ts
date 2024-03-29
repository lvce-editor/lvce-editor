import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import { CommandNotFoundError } from '../src/parts/CommandNotFoundError/CommandNotFoundError.js'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

test('CommandNotFoundError', () => {
  const error = new CommandNotFoundError('test-command')
  expect(error.name).toBe('CommandNotFoundError')
  expect(error.message).toBe('Command "test-command" not found (extension host worker)')
  expect(error.code).toBe(ErrorCodes.E_COMMAND_NOT_FOUND)
})
