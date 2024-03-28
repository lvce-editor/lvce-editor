import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const IpcParentWithElectronMessagePort = await import('../src/parts/IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.js')

const Rpc = await import('../src/parts/Rpc/Rpc.js')

test('create - error - port is not defined', async () => {
  // @ts-ignore
  Rpc.invoke.mockImplementation(async () => {
    return undefined
  })
  await expect(
    IpcParentWithElectronMessagePort.create({
      type: 1,
    }),
  ).rejects.toThrow(new Error('port must be defined'))
})

test('create - error - port is not of type MessagePort', async () => {
  // @ts-ignore
  Rpc.invoke.mockImplementation(async () => {
    return 1
  })
  await expect(
    IpcParentWithElectronMessagePort.create({
      type: 1,
    }),
  ).rejects.toThrow(new Error('port must be of type MessagePort'))
})

test('create', async () => {
  // @ts-ignore
  Rpc.invoke.mockImplementation(async () => {
    const { port1 } = new MessageChannel()
    return port1
  })
  await IpcParentWithElectronMessagePort.create({
    type: 1,
  })
  expect(Rpc.invoke).toHaveBeenCalledTimes(1)
  expect(Rpc.invoke).toHaveBeenCalledWith('IpcParent.create', {
    initialCommand: 'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
    method: 8,
    raw: true,
    type: 1,
  })
})
