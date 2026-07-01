import { expect, jest, test } from '@jest/globals'

const setup = async (isElectron: boolean) => {
  jest.resetModules()

  const ipc = {
    send: jest.fn(),
  }
  const connectIpcToElectron = jest.fn()
  const unhandleIpc = jest.fn()
  const launchProcess = jest.fn(async (_options: unknown) => ipc)

  jest.unstable_mockModule(
    '../src/parts/ConnectIpcToElectron/ConnectIpcToElectron.js',
    () => ({
      connectIpcToElectron,
    }),
  )

  jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
    unhandleIpc,
  }))

  jest.unstable_mockModule('../src/parts/IsElectron/IsElectron.js', () => ({
    isElectron,
  }))

  jest.unstable_mockModule('../src/parts/LaunchProcess/LaunchProcess.js', () => ({
    launchProcess,
  }))

  jest.unstable_mockModule(
    '../src/parts/ProcessExplorerPath/ProcessExplorerPath.js',
    () => ({
      processExplorerPath: '/test/processExplorerMain.js',
    }),
  )

  const IpcId = await import('../src/parts/IpcId/IpcId.js')
  const LaunchProcessExplorer = await import(
    '../src/parts/LaunchProcessExplorer/LaunchProcessExplorer.js'
  )

  return {
    connectIpcToElectron,
    ipc,
    IpcId,
    launchProcess,
    LaunchProcessExplorer,
    unhandleIpc,
  }
}

test('launchProcessExplorer - browser/server', async () => {
  const {
    connectIpcToElectron,
    ipc,
    IpcId,
    launchProcess,
    LaunchProcessExplorer,
    unhandleIpc,
  } = await setup(false)

  const result = await LaunchProcessExplorer.launchProcessExplorer()

  expect(result).toBe(ipc)
  expect(launchProcess).toHaveBeenCalledWith({
    name: 'Process Explorer',
    defaultPath: '/test/processExplorerMain.js',
    isElectron: false,
    settingName: 'develop.processExplorerPath',
    targetRpcId: IpcId.ProcessExplorer,
  })
  expect(connectIpcToElectron).not.toHaveBeenCalled()
  expect(unhandleIpc).toHaveBeenCalledWith(ipc)
})

test('launchProcessExplorer - electron', async () => {
  const {
    connectIpcToElectron,
    ipc,
    IpcId,
    launchProcess,
    LaunchProcessExplorer,
    unhandleIpc,
  } = await setup(true)

  const result = await LaunchProcessExplorer.launchProcessExplorer()

  expect(result).toBe(ipc)
  expect(launchProcess).toHaveBeenCalledWith({
    name: 'Process Explorer',
    defaultPath: '/test/processExplorerMain.js',
    isElectron: true,
    settingName: 'develop.processExplorerPath',
    targetRpcId: IpcId.ProcessExplorer,
  })
  expect(connectIpcToElectron).toHaveBeenCalledWith(
    ipc,
    IpcId.ProcessExplorerRenderer,
  )
  expect(unhandleIpc).toHaveBeenCalledWith(ipc)
})
