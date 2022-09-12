import { VError } from '../src/parts/VError/VError.js'

test('VError - missing child stack', () => {
  class DOMException extends Error {
    constructor(message) {
      super(message)
      this.stack = undefined
      this.name = 'DOMException'
    }
  }
  const error = new VError(
    new DOMException(
      'The requested version (1) is less than the existing version (6).'
    ),
    `Failed to save IndexedDb value`
  )
  expect(error.stack).toMatch(
    'VError: Failed to save IndexedDb value: DOMException: The requested version (1) is less than the existing version (6).'
  )
})
