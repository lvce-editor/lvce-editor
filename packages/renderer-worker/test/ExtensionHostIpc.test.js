import * as ExtensionHostIpc from '../src/parts/ExtensionHostIpc/ExtensionHostIpc.js'

test('listen - error - unexpected extension host type', () => {
  expect(() => ExtensionHostIpc.listen(123)).toThrowError(
    new Error('unexpected extension host type: 123')
  )
})
