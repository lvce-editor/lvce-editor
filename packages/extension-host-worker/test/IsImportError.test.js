import * as IsImportError from '../src/parts/IsImportError/IsImportError.js'

test('isImportError - type error', () => {
  const error = new TypeError('x is not a function')
  expect(IsImportError.isImportError(error)).toBe(false)
})

test('isImportError - chrome import error', () => {
  const error = new TypeError('Failed to fetch dynamically imported module')
  expect(IsImportError.isImportError(error)).toBe(true)
})

test('isImportError - firefox import error', () => {
  const error = new TypeError('error loading dynamically imported module')
  expect(IsImportError.isImportError(error)).toBe(true)
})

test('isImportError - syntax error without stack trace', () => {
  const error = new SyntaxError("Identifier 'x' has already been declared")
  error.stack = "SyntaxError: Identifier 'x' has already been declared"
  expect(IsImportError.isImportError(error)).toBe(true)
})
