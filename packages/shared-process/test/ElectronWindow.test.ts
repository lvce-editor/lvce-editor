import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(() => {}),
}))

const ElectronWindow = await import('../src/parts/ElectronWindow/ElectronWindow.js')
const ParentIpc = await import('../src/parts/MainProcess/MainProcess.js')

test('toggleDevtools', async () => {
  await ElectronWindow.toggleDevtools(1)
  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('ElectronWindow.executeWindowFunction', 1, 'toggleDevtools')
})
