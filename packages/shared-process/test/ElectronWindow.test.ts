import { expect, jest, test } from '@jest/globals'

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

test('toggleDevtools', async () => {
  await ElectronWindow.toggleDevtools(1)
  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('ElectronWindow.executeWindowFunction', 1, 'toggleDevtools')
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
