import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
    invokeAndTransfer: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.ts', () => {
  return {
    getPortTuple() {
      return {
        port1: {
          isPort: true,
        },
        port2: {
          isPort: true,
        },
      }
    },
  }
})

const IpcParentWithElectronMessagePort = await import('../src/parts/IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.ts')

const Rpc = await import('../src/parts/Rpc/Rpc.ts')

test('create', async () => {
  // @ts-ignore
  Rpc.invokeAndTransfer.mockImplementation(async () => {
    const { port1 } = new MessageChannel()
    return port1
  })
  await IpcParentWithElectronMessagePort.create({
    type: 1,
  })
  expect(Rpc.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(Rpc.invokeAndTransfer).toHaveBeenCalledWith(
    [{ isPort: true }],
    'SendMessagePortToElectron.sendMessagePortToElectron',
    {
      isPort: true,
    },
    'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
  )
})
