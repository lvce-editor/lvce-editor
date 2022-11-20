import * as ExtensionHostHelperProcessIpcType from '../src/parts/ExtensionHostHelperProcessIpcType/ExtensionHostHelperProcessIpcType.js'
import * as ParentIpcType from '../src/parts/IpcParentType/IpcParentType.js'

test('getIpcType - electron', () => {
  // @ts-ignore
  globalThis.navigator = {
    userAgent: 'Electron',
  }
  expect(ExtensionHostHelperProcessIpcType.getIpcType()).toBe(
    ParentIpcType.ElectronMessagePort
  )
})

test('getIpcType - chrome', () => {
  // @ts-ignore
  globalThis.navigator = {
    userAgent: 'Chrome',
  }
  expect(ExtensionHostHelperProcessIpcType.getIpcType()).toBe(
    ParentIpcType.WebSocket
  )
})
