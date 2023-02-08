import { jest } from '@jest/globals'
import * as ExtensionHostSourceControl from '../src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js'

beforeEach(() => {
  ExtensionHostSourceControl.reset()
})

test('getChangedFiles', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
    getChangedFiles() {
      return [{ file: '/test/file-1.txt', status: 1 }]
    },
  })
  expect(await ExtensionHostSourceControl.getChangedFiles('test')).toEqual([
    {
      file: '/test/file-1.txt',
      status: 1,
    },
  ])
})

test('getChangedFiles - error - no provider id specified', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
    getChangedFiles() {
      return [{ file: '/test/file-1.txt', status: 1 }]
    },
  })
  await expect(
    ExtensionHostSourceControl.getChangedFiles()
  ).rejects.toThrowError(new Error('no source control provider found'))
})

test('getEnabledProviderIds', async () => {
  const provider1 = {
    id: 'test-source-control-provider-1',
    isActive: jest.fn(() => {
      return false
    }),
  }
  const provider2 = {
    id: 'test-source-control-provider-2',
    isActive: jest.fn(() => {
      return true
    }),
  }
  ExtensionHostSourceControl.state.providers = {
    [provider1.id]: provider1,
    [provider2.id]: provider2,
  }
  expect(
    await ExtensionHostSourceControl.getEnabledProviderIds('', '/test/folder')
  ).toEqual(['test-source-control-provider-2'])
  expect(provider1.isActive).toHaveBeenCalledTimes(1)
  expect(provider1.isActive).toHaveBeenCalledWith('', '/test/folder')
  expect(provider2.isActive).toHaveBeenCalledTimes(1)
  expect(provider2.isActive).toHaveBeenCalledWith('', '/test/folder')
})
