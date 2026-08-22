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
  const rendererWorkerIpc = { off: jest.fn(), on: jest.fn() }
  const { port1, port2 } = new MessageChannel()

  await HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess(rendererWorkerIpc, port1, 'builtin.git', 'git-client')

  expect(ExtensionNodeProcessIpc.create).toHaveBeenCalledWith({
    extensionId: 'builtin.git',
    method: IpcParentType.ElectronUtilityProcess,
    rpcId: 'git-client',
  })
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'NodeRpcProcess.handleElectronMessagePort', port1)
  expect(rendererWorkerIpc.on).toHaveBeenCalledWith('close', expect.any(Function))
  expect(ipc.on).toHaveBeenCalledWith('close', expect.any(Function))
  const handleRendererClose = rendererWorkerIpc.on.mock.calls[0][1] as () => void
  handleRendererClose()
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
  const handleProcessClose = ipc.on.mock.calls[0][1] as () => void
  handleProcessClose()
  expect(rendererWorkerIpc.off).toHaveBeenCalledWith('close', handleRendererClose)
  port1.close()
  port2.close()
})

test('disposes the process when attachment fails', async () => {
  const rendererWorkerIpc = { off: jest.fn(), on: jest.fn() }
  const { port1, port2 } = new MessageChannel()
  jest.mocked(JsonRpc.invokeAndTransfer).mockRejectedValue(new Error('attach failed'))

  await expect(
    HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess(rendererWorkerIpc, port1, 'builtin.git', 'git-client'),
  ).rejects.toThrow('attach failed')
  expect(rendererWorkerIpc.off).toHaveBeenCalledWith('close', expect.any(Function))
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
  port1.close()
  port2.close()
})
