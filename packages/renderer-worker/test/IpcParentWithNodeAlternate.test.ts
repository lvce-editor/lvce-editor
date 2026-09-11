import { expect, jest, test } from '@jest/globals'

const sendMessagePortToElectron = jest.fn(async (..._args: readonly unknown[]) => {})
const createWebSocket = jest.fn(async () => ({}))
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ getPlatform: () => 2 }))
jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({
  isActive: () => true,
  getWebSocketUrl: async () => 'ws://remote/shared-process',
}))
jest.unstable_mockModule('../src/parts/SendMessagePortToElectron/SendMessagePortToElectron.js', () => ({ sendMessagePortToElectron }))
jest.unstable_mockModule('../src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js', () => ({ create: createWebSocket }))
const { create } = await import('../src/parts/IpcParentWithNodeAlternate/IpcParentWithNodeAlternate.js')

test('remote workspace activation cannot redirect shared process requests such as local recents', async () => {
  const { port1, port2 } = new MessageChannel()
  try {
    const result = await create({ type: 'shared-process', initialCommand: 'SharedProcess.connect', port: port2 })
    expect(result).toBeUndefined()
    expect(sendMessagePortToElectron).toHaveBeenCalledWith(port2, 'SharedProcess.connect', undefined)
    expect(createWebSocket).not.toHaveBeenCalled()
  } finally {
    port1.close()
    port2.close()
  }
})
