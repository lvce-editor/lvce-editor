import { jest } from '@jest/globals'
import { JsonRpcError } from '../src/parts/Errors/Errors.js'
import * as ExtensionHostRpc from '../src/parts/ExtensionHostRpc/ExtensionHostRpc.js'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'
import * as JsonRpcErrorCode from '../src/parts/JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => {
  return {
    create: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostIpc = await import(
  '../src/parts/ExtensionHostIpc/ExtensionHostIpc.js'
)
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')

test('listen - error - unexpected extension host type', async () => {
  await expect(ExtensionHostIpc.listen(123)).rejects.toThrowError(
    new Error('unexpected extension host type: 123')
  )
})

test.only('handleMessage - error - method not found', async () => {
  // @ts-ignore
  IpcParent.create.mockImplementation(() => {
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
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          error: {
            code: JsonRpcErrorCode.MethodNotFound,
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
  const ipc = await ExtensionHostIpc.listen(IpcParentType.ModuleWorker)
  const rpc = ExtensionHostRpc.listen(ipc)
  await expect(
    rpc.invoke('ExtensionHostTypeDefinition.executeTypeDefinitionProvider')
  ).rejects.toThrowError(
    new JsonRpcError(
      'method not found: ExtensionHostTypeDefinition.executeTypeDefinitionProvider'
    )
  )
})
