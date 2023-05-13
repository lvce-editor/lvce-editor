import { ChildProcessError } from '../src/parts/ChildProcessError/ChildProcessError.js'

test('ChildProcessError', () => {
  const stderr = ``
  const error = new ChildProcessError(stderr)
  expect(error).toBeInstanceOf(Error)
  expect(error.name).toBe('ChildProcessError')
  expect(error.message).toBe(`child process error: `)
})
