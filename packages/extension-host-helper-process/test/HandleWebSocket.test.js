import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IpcChild/IpcChild.js', () => ({
  listen: jest.fn(),
}))

const CommandMapRef = await import('../src/parts/CommandMapRef/CommandMapRef.js')
const HandleWebSocket = await import('../src/parts/HandleWebSocket/HandleWebSocket.js')
const IpcChild = await import('../src/parts/IpcChild/IpcChild.js')

test('passes dynamically loaded commands to the websocket rpc', async () => {
  const closeListener = jest.fn()
  const handle = {
    on: jest.fn(),
  }
  const request = {}
  CommandMapRef.commandMapRef['Exec.exec'] = closeListener

  await HandleWebSocket.handleWebSocket(handle, request)

  expect(IpcChild.listen).toHaveBeenCalledWith({
    commandMap: CommandMapRef.commandMapRef,
    method: 6,
    request,
    handle,
  })
})
