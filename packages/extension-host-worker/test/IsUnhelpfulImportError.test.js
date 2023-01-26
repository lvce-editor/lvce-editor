import * as IsUnhelpfulImportError from '../src/parts/IsUnhelpfulImportError/IsUnhelpfulImportError.js'

test('isUnhelpfulImportError - type error', () => {
  const error = new TypeError('x is not a function')
  expect(IsUnhelpfulImportError.isUnhelpfulImportError(error)).toBe(false)
})

// TODO maybe rename function to isHelpfulImportError to avoid double negative
test('isUnhelpfulImportError - chrome error', () => {
  const error = new TypeError('Failed to fetch dynamically imported module')
  expect(IsUnhelpfulImportError.isUnhelpfulImportError(error)).toBe(true)
})
