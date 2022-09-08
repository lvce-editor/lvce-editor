const Platform = require('../src/parts/Platform/Platform.js')

test('isProduction', () => {
  expect(typeof Platform.isProduction).toBe('boolean')
})

test('isLinux', () => {
  expect(typeof Platform.isLinux).toBe('boolean')
})

test('isMacOs', () => {
  expect(typeof Platform.isMacOs).toBe('boolean')
})

test('getBuiltinSelfTestPath', () => {
  expect(typeof Platform.getBuiltinSelfTestPath()).toBe('string')
})

test('applicationName', () => {
  expect(typeof Platform.applicationName).toBe('string')
})

test('getVersion', () => {
  expect(typeof Platform.version).toBe('string')
})

test('getCommit', () => {
  expect(typeof Platform.commit).toBe('string')
})

test('getScheme', () => {
  expect(typeof Platform.scheme).toBe('string')
})
