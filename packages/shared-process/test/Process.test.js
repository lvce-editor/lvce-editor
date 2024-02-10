import * as Process from '../src/parts/Process/Process.js'
import * as Signal from '../src/parts/Signal/Signal.js'
import { jest } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  process.kill = jest.fn()
})

test('crash', () => {
  expect(Process.crash).toThrow()
})

test('crashAsync', () => {
  expect(Process.crashAsync).rejects.toThrow()
})

test('kill - ESRCH', () => {
  const pid = 123
  const signal = Signal.SIGINT
  // @ts-ignore
  process.kill.mockImplementation(() => {
    throw new Error('kill ESRCH')
  })
  expect(() => Process.kill(pid, signal)).toThrow(new Error('Failed to kill process 123 with signal SIGINT: kill ESRCH'))
})
