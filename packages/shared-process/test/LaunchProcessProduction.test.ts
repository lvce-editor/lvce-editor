import { afterEach, expect, jest, test } from '@jest/globals'
import { fileURLToPath } from 'node:url'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ isProduction: true }))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getAll: jest.fn(() => {
    throw new Error('Packaged process launch must not load development preferences')
  }),
  getOverrides: jest.fn(() => ({})),
}))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({ handleIpc: jest.fn() }))
jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({ create: jest.fn(async () => ({})) }))

const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const LaunchProcess = await import('../src/parts/LaunchProcess/LaunchProcess.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const nativePath = fileURLToPath(import.meta.url)
const options = {
  defaultPath: '/packaged/auth-process.js',
  isElectron: false,
  name: 'Auth Process',
  settingName: 'develop.authProcessPath',
  targetRpcId: 123,
}

afterEach(() => {
  jest.clearAllMocks()
  jest.mocked(Preferences.getOverrides).mockReturnValue({})
})

test('packaged auth process launch honors an existing explicit CLI path', async () => {
  jest.mocked(Preferences.getOverrides).mockReturnValue({ 'develop.authProcessPath': nativePath })
  await LaunchProcess.launchProcess(options)
  expect(IpcParent.create).toHaveBeenCalledWith(expect.objectContaining({ path: nativePath }))
  expect(Preferences.getAll).not.toHaveBeenCalled()
})

test('packaged auth process launch retains its default without a CLI override', async () => {
  await LaunchProcess.launchProcess(options)
  expect(IpcParent.create).toHaveBeenCalledWith(expect.objectContaining({ path: options.defaultPath }))
  expect(Preferences.getAll).not.toHaveBeenCalled()
})

test('packaged auth process launch ignores a missing CLI path', async () => {
  jest.mocked(Preferences.getOverrides).mockReturnValue({ 'develop.authProcessPath': `${nativePath}/missing.js` })
  await LaunchProcess.launchProcess(options)
  expect(IpcParent.create).toHaveBeenCalledWith(expect.objectContaining({ path: options.defaultPath }))
  expect(Preferences.getAll).not.toHaveBeenCalled()
})
