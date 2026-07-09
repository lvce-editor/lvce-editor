import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GetAppWindowOptions/GetAppWindowOptions.js', () => ({
  getAppWindowOptions: jest.fn(() => ({})),
}))

jest.unstable_mockModule('../src/parts/GetTitleBarItems/GetTitleBarItems.js', () => ({
  getTitleBarItems: jest.fn(() => []),
}))

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getAll: jest.fn(() => ({})),
}))

jest.unstable_mockModule('../src/parts/PreloadUrl/PreloadUrl.js', () => ({
  getPreloadUrl: jest.fn(() => 'file:///preload.js'),
}))

jest.unstable_mockModule('../src/parts/Screen/Screen.js', () => ({
  getBounds: jest.fn(() => ({ width: 1920, height: 1080 })),
}))

const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')
const ParentIpc = await import('../src/parts/MainProcess/MainProcess.js')

test('openNewWithUri', async () => {
  await AppWindow.openNewWithUri('/workspace/file.txt')

  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('AppWindow.createAppWindow', {}, [], '', [], 'lvce-oss://-/?openUri=%2Fworkspace%2Ffile.txt')
})
