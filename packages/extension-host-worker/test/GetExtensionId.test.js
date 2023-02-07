import * as GetExtensionId from '../src/parts/GetExtensionId/GetExtensionId.js'

test('getExtensionId - null', () => {
  expect(GetExtensionId.getExtensionId(null)).toBe('<unknown>')
})

test('getExtensionId - array', () => {
  expect(GetExtensionId.getExtensionId([])).toBe('<unknown>')
})

test('getExtensionId - symbol', () => {
  expect(GetExtensionId.getExtensionId(Symbol())).toBe('<unknown>')
})

test('getExtensionId - id', () => {
  expect(GetExtensionId.getExtensionId({ id: 'test-id' })).toBe('test-id')
})

test('getExtensionId - path', () => {
  expect(GetExtensionId.getExtensionId({ path: '/test/test-extension' })).toBe('test-extension')
})
