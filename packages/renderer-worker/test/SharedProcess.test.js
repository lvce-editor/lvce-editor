import { expect, jest, test } from '@jest/globals'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as SharedProcessState from '../src/parts/SharedProcessState/SharedProcessState.js'

test.skip('invoke - error', async () => {
  SharedProcessState.state.ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      switch (message.method) {
        case 123456:
          // @ts-ignore
          SharedProcess.handleMessageFromSharedProcess({
            jsonrpc: JsonRpcVersion.Two,
            // @ts-ignore
            id: message.id,
            error: {
              code: -32000,
              message:
                'OperationalError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\'',
              data: 'VError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\'\n    at Object.readDirWithFileTypes (file:///test/packages/shared-process/src/parts/FileSystem/FileSystem.js:161:11)\n    at async MessagePort.handleOtherMessagesFromMessagePort (file:///test/packages/shared-process/src/parts/ParentIpc/ParentIpc.js:79:26)',
            },
          })
          break
        default:
          throw new Error('unexpected message')
      }
    }),
  }
  await expect(SharedProcess.invoke(123456, 42)).rejects.toThrow(
    new Error(
      'OperationalError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\'',
    ),
  )
})

test.skip('invoke - error stack', async () => {
  SharedProcessState.state.ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      switch (message.method) {
        case 123456:
          // @ts-ignore
          SharedProcess.handleMessageFromSharedProcess({
            jsonrpc: JsonRpcVersion.Two,
            // @ts-ignore
            id: message.id,
            error: {
              code: -32000,
              message:
                'OperationalError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\'',
              data: 'VError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\'\n    at Object.readDirWithFileTypes (file:///test/packages/shared-process/src/parts/FileSystem/FileSystem.js:161:11)\n    at async MessagePort.handleOtherMessagesFromMessagePort (file:///test/packages/shared-process/src/parts/ParentIpc/ParentIpc.js:79:26)',
            },
          })
          break
        default:
          throw new Error('unexpected message')
      }
    }),
  }
  const error = await SharedProcess.invoke(123456, 42).catch((error) => error)
  expect(error.stack).toEqual(
    expect.stringMatching(
      'Error: OperationalError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\'',
    ),
  )
})
