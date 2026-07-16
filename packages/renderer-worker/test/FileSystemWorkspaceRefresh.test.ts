import { beforeEach, expect, jest, test } from '@jest/globals'

const execute = jest.fn()
const remove = jest.fn()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute,
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const FileSystemState = await import('../src/parts/FileSystemState/FileSystemState.js')

FileSystemState.registerAll({
  test() {
    return {
      remove,
    }
  },
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('remove notifies workspace views with the deleted uri', async () => {
  await FileSystem.remove('test://some-file.txt')

  expect(remove).toHaveBeenCalledWith('test://some-file.txt')
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', ['test://some-file.txt'])
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})
