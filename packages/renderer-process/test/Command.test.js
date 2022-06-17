import { jest } from '@jest/globals'
import * as Command from '../src/parts/Command/Command.js'

test('register', () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  expect(Command.state.commands[-12]).toBe(mockFn)
})

test('execute - command already registered', async () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  await Command.execute(-12, 'abc')
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(mockFn).toBeCalledWith('abc')
})

test('execute - command already registered but throws error', async () => {
  const mockFn = jest.fn(() => {
    throw new Error('Oops')
  })
  Command.register(-12, mockFn)
  expect(() => Command.execute(-12, 'abc')).toThrowError(new Error('Oops'))
})
