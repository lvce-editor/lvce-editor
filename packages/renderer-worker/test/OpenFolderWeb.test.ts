import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const OpenFolderWeb = await import('../src/parts/OpenFolderWeb/OpenFolderWeb.js')
const execute = jest.mocked(Command.execute)

beforeEach(() => {
  jest.clearAllMocks()
})

test('openFolder', async () => {
  const handle = { name: 'test' }
  execute.mockResolvedValueOnce(handle)

  await OpenFolderWeb.openFolder()

  expect(Command.execute).toHaveBeenNthCalledWith(1, 'FilePicker.showDirectoryPicker', {
    mode: 'readwrite',
    startIn: 'pictures',
  })
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'PersistentFileHandle.addHandle', 'html:///test', handle)
  expect(Command.execute).toHaveBeenNthCalledWith(3, 'Workspace.setPath', 'html:///test')
})

test('openFolder - canceled', async () => {
  execute.mockRejectedValueOnce(new DOMException('The user aborted a request.', 'AbortError'))

  await expect(OpenFolderWeb.openFolder()).resolves.toBeUndefined()

  expect(Command.execute).toHaveBeenCalledTimes(1)
})

test('openFolder - unsupported', async () => {
  execute.mockRejectedValueOnce(new Error('showDirectoryPicker not supported on this browser'))

  await expect(OpenFolderWeb.openFolder()).resolves.toBeUndefined()

  expect(Command.execute).toHaveBeenNthCalledWith(2, 'Dialog.showWarning', {
    message: "Your browser doesn't support opening local folders.",
    title: 'Opening Local Folders is Unsupported',
  })
})

test('openFolder - error', async () => {
  execute.mockRejectedValueOnce(new Error('unexpected'))

  await expect(OpenFolderWeb.openFolder()).rejects.toThrow('Failed to open folder: unexpected')
})
