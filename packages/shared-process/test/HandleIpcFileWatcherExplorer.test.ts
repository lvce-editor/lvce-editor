import { expect, test } from '@jest/globals'
import * as HandleIpcFileWatcherExplorer from '../src/parts/HandleIpcFileWatcherExplorer/HandleIpcFileWatcherExplorer.js'

test('upgradeMessagePort', () => {
  const port: Record<string, any> = {}
  expect(HandleIpcFileWatcherExplorer.upgradeMessagePort(port)).toEqual({
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  })
})

test('upgradeWebSocket', () => {
  const message: Record<string, any> = {}
  const handle = {
    isHandle: true,
  }
  expect(HandleIpcFileWatcherExplorer.upgradeWebSocket(handle, message)).toEqual({
    method: 'HandleWebSocket.handleWebSocket',
    params: [
      {
        isHandle: true,
      },
      {},
    ],
    type: 'send',
  })
})
