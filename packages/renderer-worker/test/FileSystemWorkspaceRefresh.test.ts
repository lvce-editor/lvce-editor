import { beforeEach, expect, jest, test } from '@jest/globals'

const execute = jest.fn()
const remove = jest.fn()
const rename = jest.fn()
const writeFile = jest.fn()

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
      rename,
      writeFile,
    }
  },
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('remove notifies workspace views with the deleted uri', async () => {
  await FileSystem.remove('test://some-file.txt')

  expect(remove).toHaveBeenCalledWith('test://some-file.txt')
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    deleted: ['test://some-file.txt'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('rename notifies workspace views with the old and new uris', async () => {
  await FileSystem.rename('test://old-folder', 'test://new-folder')

  expect(rename).toHaveBeenCalledWith('test://old-folder', 'test://new-folder')
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    renamed: [['test://old-folder', 'test://new-folder']],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('writeFile notifies workspace views with the changed uri', async () => {
  await FileSystem.writeFile('test://some-file.txt', 'updated')

  expect(writeFile).toHaveBeenCalledWith('test://some-file.txt', 'updated', 'utf8')
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    changed: ['test://some-file.txt'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('writeFile can skip reloading workspace views while refreshing the source control badge', async () => {
  await FileSystem.writeFile('test://some-file.txt', 'updated', 'utf8', false)

  expect(writeFile).toHaveBeenCalledWith('test://some-file.txt', 'updated', 'utf8')
  expect(execute).not.toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', expect.anything())
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})
