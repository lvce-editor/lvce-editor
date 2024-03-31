import { expect, test } from '@jest/globals'
import { CommandNotFoundError } from '../src/parts/CommandNotFoundError/CommandNotFoundError.ts'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'

test('CommandNotFoundError', () => {
  const error = new CommandNotFoundError('test-command')
  expect(error.name).toBe('CommandNotFoundError')
  expect(error.message).toBe('Command "test-command" not found (extension host worker)')
  // @ts-ignore
  expect(error.code).toBe(ErrorCodes.E_COMMAND_NOT_FOUND)
})
