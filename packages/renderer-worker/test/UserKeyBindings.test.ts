import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  readFile: jest.fn(),
}))

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const UserKeyBindings = await import('../src/parts/UserKeyBindings/UserKeyBindings.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('getKeyBindings loads valid user entries from persisted keybindings', async () => {
  const userKeyBinding = { command: 'Explorer.focusNext', key: 29, when: 13, source: 'User' }
  jest.mocked(FileSystem.readFile).mockResolvedValue(
    JSON.stringify([
      { command: 'Explorer.focusNext', key: 16, when: 13, source: 'System' },
      userKeyBinding,
      { command: '', key: 30, source: 'User' },
    ]),
  )

  await expect(UserKeyBindings.getKeyBindings()).resolves.toEqual([userKeyBinding])
  expect(FileSystem.readFile).toHaveBeenCalledWith('app://keybindings.json')
})

test.each(['{}', 'invalid json'])('getKeyBindings ignores invalid persisted content: %s', async (content) => {
  jest.mocked(FileSystem.readFile).mockResolvedValue(content)

  await expect(UserKeyBindings.getKeyBindings()).resolves.toEqual([])
})

test('getKeyBindings ignores read errors', async () => {
  jest.mocked(FileSystem.readFile).mockRejectedValue(new Error('EACCES'))

  await expect(UserKeyBindings.getKeyBindings()).resolves.toEqual([])
})
