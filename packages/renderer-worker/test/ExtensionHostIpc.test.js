import { jest } from '@jest/globals'
import { JsonRpcError } from '../src/parts/Errors/Errors.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHostIpc/ExtensionHostIpcWithWebWorker.js',
  () => {
    return {
      listen: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostIpc = await import(
  '../src/parts/ExtensionHostIpc/ExtensionHostIpc.js'
)
const ExtensionHostIpcWithWebWorker = await import(
  '../src/parts/ExtensionHostIpc/ExtensionHostIpcWithModuleWorker.js'
)

test('listen - error - unexpected extension host type', async () => {
  await expect(ExtensionHostIpc.listen(123)).rejects.toThrowError(
    new Error('unexpected extension host type: 123')
  )
})

test.only('handleMessage - error - method not found', async () => {
  // @ts-ignore
  ExtensionHostIpcWithWebWorker.create.mockImplementation(() => {
    let _onmessage
    return {
      get onmessage() {
        return _onmessage
      },
      set onmessage(listener) {
        _onmessage = listener
      },
      send(message) {
        _onmessage({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32601,
            message: `method not found: ${message.method}`,
            data: `Error: method not found: ${message.method}
  at getFn (/test/Command.js:19:13)
  at Module.execute (/test/Command.js:24:14)
  at handleMessage (/test/Ipc/Ipc.js:31:38)`,
          },
        })
      },
    }
  })
  const ipc = await ExtensionHostIpc.listen(
    ExtensionHostIpc.Methods.ModuleWebWorker
  )
  await expect(
    ipc.invoke('ExtensionHostTypeDefinition.executeTypeDefinitionProvider')
  ).rejects.toThrowError(
    new JsonRpcError(
      'method not found: ExtensionHostTypeDefinition.executeTypeDefinitionProvider'
    )
  )
})
