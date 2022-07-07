import { jest } from '@jest/globals'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('invoke - error', async () => {
  SharedProcess.state.ipc = {
    send: jest.fn((message) => {
      switch (message.method) {
        case 123456:
          SharedProcess.handleMessageFromSharedProcess({
            jsonrpc: '2.0',
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
  await expect(SharedProcess.invoke(123456, 42)).rejects.toThrowError(
    new Error(
      'OperationalError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\''
    )
  )
})

test('invoke - error stack', async () => {
  SharedProcess.state.ipc = {
    send: jest.fn((message) => {
      switch (message.method) {
        case 123456:
          SharedProcess.handleMessageFromSharedProcess({
            jsonrpc: '2.0',
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
      'Error: OperationalError: Failed to read directory "/test/playground,languages": ENOENT: no such file or directory, scandir \'/test/playground,languages\''
    )
  )
})
