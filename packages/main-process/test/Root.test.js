const Root = require('../src/parts/Root/Root.cjs')

test('root', () => {
  expect(typeof Root.root).toBe('string')
})
