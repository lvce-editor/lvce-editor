import { CancelationError } from '../src/parts/Errors/CancelationError.js'

test('CancelationError', () => {
  const error = new CancelationError()
  expect(error).toBeInstanceOf(Error)
  expect(error.name).toBe('CancelationError')
})
