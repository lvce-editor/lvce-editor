import { expect, jest, test } from '@jest/globals'

const setup = async (): Promise<any> => {
  jest.resetModules()

  const ipc = {
    send: jest.fn(),
  }
  const invoke = jest.fn()
  const launchProcess = jest.fn(async (_options: any) => ipc)
  const set = jest.fn()

  jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
    RpcId: {
      AuthWorker: 1,
      ClipBoardProcess: 2,
      EmbedsProcess: 3,
      EmbedsWorker: 4,
      ExtensionHostWorker: 5,
      FileSystemProcess: 6,
      MainProcess: 7,
      SearchProcess: 8,
      SharedProcess: 9,
    },
    set,
  }))

  jest.unstable_mockModule('../src/parts/FileSystemProcessPath/FileSystemProcessPath.js', () => ({
    fileSystemProcessPath: '/test/fileSystemProcessMain.js',
  }))

  jest.unstable_mockModule('../src/parts/IsElectron/IsElectron.js', () => ({
    isElectron: false,
  }))

  jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
    invoke,
  }))

  jest.unstable_mockModule('../src/parts/LaunchProcess/LaunchProcess.js', () => ({
    launchProcess,
  }))

  jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
    getCacheDir: (): string => '/test/cache/lvce-editor',
  }))

  const IpcId = await import('../src/parts/IpcId/IpcId.js')
  const LaunchFileSystemProcess = await import('../src/parts/LaunchFileSystemProcess/LaunchFileSystemProcess.js')

  return {
    invoke,
    ipc,
    IpcId,
    LaunchFileSystemProcess,
    launchProcess,
    set,
  }
}

test('launchFileSystemProcess - initializes with product cache directory', async () => {
  const { invoke, ipc, IpcId, LaunchFileSystemProcess, launchProcess, set } = await setup()

  const result = await LaunchFileSystemProcess.launchFileSystemProcess()

  expect(result).toBe(ipc)
  expect(launchProcess).toHaveBeenCalledWith({
    defaultPath: '/test/fileSystemProcessMain.js',
    isElectron: false,
    name: 'File System Process',
    settingName: 'develop.fileSystemProcessPath',
    targetRpcId: IpcId.FileSystemProcess,
  })
  expect(set).toHaveBeenCalledWith(IpcId.FileSystemProcess, ipc)
  expect(invoke).toHaveBeenCalledWith(ipc, 'Initialize.initialize', '/test/cache/lvce-editor')
})
