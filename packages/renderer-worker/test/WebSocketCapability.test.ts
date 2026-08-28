/* eslint-disable jest/no-restricted-jest-methods -- Module boundary tests require ESM dependency mocks. */
import { expect, jest, test } from '@jest/globals'

const getWebSocketUrl = jest.fn<(_type: string) => Promise<string>>(async () => 'ws://remote.example/process')
const isActive = jest.fn(() => true)

jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({
  getWebSocketUrl,
  isActive,
}))

const WebSocketCapability = await import('../src/parts/WebSocketCapability/WebSocketCapability.js')

test('isActive returns workspace connection state', () => {
  expect(WebSocketCapability.isActive()).toBe(true)
  expect(isActive).toHaveBeenCalledTimes(1)
})

test('create returns remote websocket capability', async () => {
  await expect(WebSocketCapability.create('process-explorer')).resolves.toEqual({
    protocols: [],
    url: 'ws://remote.example/process',
  })
  expect(getWebSocketUrl).toHaveBeenCalledWith('process-explorer')
})
