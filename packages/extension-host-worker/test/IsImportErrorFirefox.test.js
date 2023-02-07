import * as IsImportErrorFirefox from '../src/parts/IsImportErrorFirefox/IsImportErrorFirefox.js'

test('isImportErrorFirefox', () => {
  const error = new TypeError('error loading dynamically imported module')
  expect(IsImportErrorFirefox.isImportErrorFirefox(error)).toBe(true)
})

test('isImportErrorFirefox - other error', () => {
  const error = new TypeError('x is not a function')
  expect(IsImportErrorFirefox.isImportErrorFirefox(error)).toBe(false)
})
