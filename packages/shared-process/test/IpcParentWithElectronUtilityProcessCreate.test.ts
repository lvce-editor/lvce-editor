import { expect, jest, test } from '@jest/globals'

const port1: any = {
  close: jest.fn(),
  start: jest.fn(),
}
const port2 = {}
const createUtilityProcessRpc = jest.fn(async () => {})
const sendTo2 = jest.fn(async () => {})
const invoke = jest.fn<(method: string, name: string) => Promise<void>>(async () => {})

jest.unstable_mockModule('../src/parts/CreateUtilityProcessRpc/CreateUtilityProcessRpc.js', () => ({
  createUtilityProcessRpc,
}))

jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: jest.fn(async () => ({ port1, port2 })),
}))

jest.unstable_mockModule('../src/parts/TemporaryMessagePort/TemporaryMessagePort.js', () => ({
  sendTo2,
}))

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke,
}))

const IpcParentWithElectronUtilityProcess = await import('../src/parts/IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.js')

test('create preserves the utility process name for disposal', async () => {
  const rawIpc = await IpcParentWithElectronUtilityProcess.create({
    ipcId: 1,
    name: 'Extension Host',
    targetRpcId: 2,
  })
  const ipc = IpcParentWithElectronUtilityProcess.wrap(rawIpc)

  ipc.dispose()

  expect(port1.start).toHaveBeenCalledTimes(1)
  expect(port1.close).toHaveBeenCalledTimes(1)
  expect(invoke).toHaveBeenCalledWith('TemporaryMessagePort.dispose', 'Extension Host')
})
