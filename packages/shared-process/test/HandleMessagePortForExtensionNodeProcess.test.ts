import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

const ipc = {
  dispose: jest.fn(),
  on: jest.fn(),
}

jest.unstable_mockModule('../src/parts/ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.js', () => ({
  create: jest.fn(async () => ipc),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

const ExtensionNodeProcessIpc = await import('../src/parts/ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.js')
const HandleMessagePortForExtensionNodeProcess =
  await import('../src/parts/HandleMessagePortForExtensionNodeProcess/HandleMessagePortForExtensionNodeProcess.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(ExtensionNodeProcessIpc.create).mockResolvedValue(ipc)
  jest.mocked(JsonRpc.invokeAndTransfer).mockResolvedValue(undefined)
})

test('launches one extension process and transfers its restricted message port', async () => {
  const rendererWorkerIpc = new EventTarget()
  const addEventListenerSpy = jest.spyOn(rendererWorkerIpc, 'addEventListener')
  const removeEventListenerSpy = jest.spyOn(rendererWorkerIpc, 'removeEventListener')
  const { port1, port2 } = new MessageChannel()

  await HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess(rendererWorkerIpc, port1, 'builtin.git', 'git-client')

  expect(ExtensionNodeProcessIpc.create).toHaveBeenCalledWith({
    extensionId: 'builtin.git',
    method: IpcParentType.ElectronUtilityProcess,
    rpcId: 'git-client',
  })
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'NodeRpcProcess.handleElectronMessagePort', port1)
  expect(addEventListenerSpy).toHaveBeenCalledWith('close', expect.any(Function))
  expect(ipc.on).toHaveBeenCalledWith('close', expect.any(Function))
  rendererWorkerIpc.dispatchEvent(new Event('close'))
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
  const handleProcessClose = ipc.on.mock.calls[0][1] as () => void
  handleProcessClose()
  expect(removeEventListenerSpy).toHaveBeenCalledWith('close', expect.any(Function))
  port1.close()
  port2.close()
})

test('disposes the process when attachment fails', async () => {
  const rendererWorkerIpc = new EventTarget()
  const removeEventListenerSpy = jest.spyOn(rendererWorkerIpc, 'removeEventListener')
  const { port1, port2 } = new MessageChannel()
  jest.mocked(JsonRpc.invokeAndTransfer).mockRejectedValue(new Error('attach failed'))

  await expect(
    HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess(rendererWorkerIpc, port1, 'builtin.git', 'git-client'),
  ).rejects.toThrow('attach failed')
  expect(removeEventListenerSpy).toHaveBeenCalledWith('close', expect.any(Function))
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
  port1.close()
  port2.close()
})
