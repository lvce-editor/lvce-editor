import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostSourceControl = await import('../src/parts/ExtensionHost/ExtensionHostSourceControl.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const extensionManagementInvoke = ExtensionManagementWorker.invoke as any

test('acceptInput', async () => {
  // @ts-ignore
  extensionManagementInvoke.mockImplementation(async () => {
    return { found: true, result: undefined }
  })
  expect(await ExtensionHostSourceControl.acceptInput('git', 'message')).toBeUndefined()
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.executeSourceControlProvider',
    'git',
    'executeSourceControlAcceptInput',
    'message',
  )
})

test('acceptInput - error', async () => {
  // @ts-ignore
  extensionManagementInvoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostSourceControl.acceptInput()).rejects.toThrow(new TypeError('x is not a function'))
})

test('getChangedFiles - no provider', async () => {
  extensionManagementInvoke.mockResolvedValue({ found: false })
  await expect(ExtensionHostSourceControl.getChangedFiles('missing')).rejects.toThrow(new Error('No source control provider found'))
})

test('getEnabledProviderIds', async () => {
  extensionManagementInvoke.mockResolvedValue(['git'])
  await expect(ExtensionHostSourceControl.getEnabledProviderIds('file', '/workspace')).resolves.toEqual(['git'])
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.getEnabledSourceControlProviderIds', 'file', '/workspace')
})

// TODO test getChangedFiles

// TODO test getFileBefore
