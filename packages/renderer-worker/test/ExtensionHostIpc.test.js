import * as ExtensionHostIpc from '../src/parts/ExtensionHostIpc/ExtensionHostIpc.js'

test('listen - error - unexpected extension host type', async () => {
  await expect(ExtensionHostIpc.listen(123)).rejects.toThrowError(
    new Error('unexpected extension host type: 123')
  )
})
