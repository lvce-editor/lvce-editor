import { expect, jest, test } from '@jest/globals'

const setup = async (isElectron: any): Promise<any> => {
  jest.resetModules()

  const ipc = {
    send: jest.fn(),
  }
  const unhandleIpc = jest.fn()
  const launchProcess = jest.fn(async (_options: any) => ipc)

  jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
    unhandleIpc,
  }))

  jest.unstable_mockModule('../src/parts/IsElectron/IsElectron.js', () => ({
    isElectron,
  }))

  jest.unstable_mockModule('../src/parts/LaunchProcess/LaunchProcess.js', () => ({
    launchProcess,
  }))

  jest.unstable_mockModule('../src/parts/FileWatcherExplorerPath/FileWatcherExplorerPath.js', () => ({
    fileWatcherExplorerPath: '/test/fileWatcherExplorerMain.js',
  }))

  const IpcId = await import('../src/parts/IpcId/IpcId.js')
  const LaunchFileWatcherExplorer = await import('../src/parts/LaunchFileWatcherExplorer/LaunchFileWatcherExplorer.js')

  return {
    ipc,
    IpcId,
    LaunchFileWatcherExplorer,
    launchProcess,
    unhandleIpc,
  }
}

test('launchFileWatcherExplorer - browser/server', async () => {
  const { ipc, IpcId, LaunchFileWatcherExplorer, launchProcess, unhandleIpc } = await setup(false)

  const result = await LaunchFileWatcherExplorer.launchFileWatcherExplorer()

  expect(result).toBe(ipc)
  expect(launchProcess).toHaveBeenCalledWith({
    defaultPath: '/test/fileWatcherExplorerMain.js',
    isElectron: false,
    name: 'File Watcher Explorer',
    settingName: 'develop.fileWatcherExplorerPath',
    targetRpcId: IpcId.FileWatcherExplorer,
  })
  expect(unhandleIpc).toHaveBeenCalledWith(ipc)
})

test('launchFileWatcherExplorer - electron', async () => {
  const { ipc, IpcId, LaunchFileWatcherExplorer, launchProcess, unhandleIpc } = await setup(true)

  const result = await LaunchFileWatcherExplorer.launchFileWatcherExplorer()

  expect(result).toBe(ipc)
  expect(launchProcess).toHaveBeenCalledWith({
    defaultPath: '/test/fileWatcherExplorerMain.js',
    isElectron: true,
    name: 'File Watcher Explorer',
    settingName: 'develop.fileWatcherExplorerPath',
    targetRpcId: IpcId.FileWatcherExplorer,
  })
  expect(unhandleIpc).toHaveBeenCalledWith(ipc)
})
