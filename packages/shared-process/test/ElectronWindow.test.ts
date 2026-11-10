import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/AppWindow/AppWindow.js', () => ({
  openNew: jest.fn(() => {}),
  openNewWithUri: jest.fn(() => {}),
}))

const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')
const ElectronWindow = await import('../src/parts/ElectronWindow/ElectronWindow.js')
const ParentIpc = await import('../src/parts/MainProcess/MainProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('toggleDevtools', async () => {
  await ElectronWindow.toggleDevtools(1)
  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('ElectronWindow.executeWindowFunction', 1, 'toggleDevtools')
})

test('toggleFullScreen', async () => {
  await ElectronWindow.toggleFullScreen(1)
  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('ElectronWindow.executeWindowFunction', 1, 'toggleFullScreen')
})

test('openNewWithUri', async () => {
  await ElectronWindow.openNewWithUri(1, '/workspace/file.txt')
  expect(AppWindow.openNewWithUri).toHaveBeenCalledTimes(1)
  expect(AppWindow.openNewWithUri).toHaveBeenCalledWith('/workspace/file.txt')
})

test('openNew forwards url', async () => {
  await ElectronWindow.openNew(1, 'lvce-oss://-/?test=1')
  expect(AppWindow.openNew).toHaveBeenCalledTimes(1)
  expect(AppWindow.openNew).toHaveBeenCalledWith('lvce-oss://-/?test=1')
})

test('zoomIn allows zooming beyond the previous maximum and clamps at the new maximum', async () => {
  const invoke = jest.mocked(ParentIpc.invoke)
  invoke.mockResolvedValueOnce(5.8).mockResolvedValueOnce(undefined).mockResolvedValueOnce(6)

  await ElectronWindow.zoomIn(1)
  await ElectronWindow.zoomIn(1)

  expect(invoke).toHaveBeenNthCalledWith(1, 'ElectronWindow.executeWebContentsFunction', 1, 'getZoomLevel')
  expect(invoke).toHaveBeenNthCalledWith(2, 'ElectronWindow.executeWebContentsFunction', 1, 'setZoomLevel', 6)
  expect(invoke).toHaveBeenNthCalledWith(3, 'ElectronWindow.executeWebContentsFunction', 1, 'getZoomLevel')
  expect(invoke).toHaveBeenNthCalledWith(4, 'ElectronWindow.executeWebContentsFunction', 1, 'setZoomLevel', 6)
})

test('zoomOut and zoomReset remain available at the new maximum', async () => {
  const invoke = jest.mocked(ParentIpc.invoke)
  invoke.mockResolvedValueOnce(6)

  await ElectronWindow.zoomOut(1)
  await ElectronWindow.zoomReset(1)

  expect(invoke).toHaveBeenNthCalledWith(2, 'ElectronWindow.executeWebContentsFunction', 1, 'setZoomLevel', 5.8)
  expect(invoke).toHaveBeenNthCalledWith(3, 'ElectronWindow.executeWebContentsFunction', 1, 'setZoomLevel', 0)
})
