import * as Error from '../src/parts/Error/Error.js'

// TODO don't shim global Error object

// TODO
test('OperationalError', () => {
  const error = globalThis.Error('enoent: no such file')
  const operationalError = new Error.OperationalError({
    cause: error,
    code: 'E_FAILED_TO_READ_FILE',
    message: 'Failed to read file',
  })
  expect(operationalError.toString()).toBe(
    'OperationalError: Failed to read file: enoent: no such file'
  )
})
