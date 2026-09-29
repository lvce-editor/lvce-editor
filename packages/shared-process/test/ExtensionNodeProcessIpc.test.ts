import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

const ipc = {}

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(async () => ipc),
}))

jest.unstable_mockModule('../src/parts/ResolveExtensionNodeProcess/ResolveExtensionNodeProcess.js', () => ({
  resolveExtensionNodeProcess: jest.fn(async () => ({ name: 'Extension builtin.git: Git', path: '/extensions/builtin.git/process.js' })),
}))

const ExtensionNodeProcessIpc = await import('../src/parts/ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const ResolveExtensionNodeProcess = await import('../src/parts/ResolveExtensionNodeProcess/ResolveExtensionNodeProcess.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(IpcParent.create).mockResolvedValue(ipc)
  jest
    .mocked(ResolveExtensionNodeProcess.resolveExtensionNodeProcess)
    .mockResolvedValue({ name: 'Extension builtin.git: Git', path: '/extensions/builtin.git/process.js' })
})

test('resolves extension and rpc ids before launching the executable', async () => {
  await expect(
    ExtensionNodeProcessIpc.create({ extensionId: 'builtin.git', method: IpcParentType.ElectronUtilityProcess, rpcId: 'git-client' }),
  ).resolves.toBe(ipc)

  expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess).toHaveBeenCalledWith('builtin.git', 'git-client')
  expect(IpcParent.create).toHaveBeenCalledWith({
    execArgv: [],
    method: IpcParentType.ElectronUtilityProcess,
    name: 'Extension builtin.git: Git',
    path: '/extensions/builtin.git/process.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
})
