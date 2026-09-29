import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Prompt/Prompt.js', () => ({
  prompt: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const OpenFolderRemote = await import('../src/parts/OpenFolderRemote/OpenFolderRemote.js')
const Prompt = await import('../src/parts/Prompt/Prompt.js')
const prompt = jest.mocked(Prompt.prompt)

beforeEach(() => {
  jest.clearAllMocks()
})

test('openFolder', async () => {
  prompt.mockResolvedValue('/home/test/project')

  await OpenFolderRemote.openFolder()

  expect(Prompt.prompt).toHaveBeenCalledWith('Choose Path:', '/home')
  expect(Command.execute).toHaveBeenCalledWith('Workspace.setUri', 'file:///home/test/project')
})

test('openFolder - encodes path as file uri', async () => {
  prompt.mockResolvedValue('/home/test/my folder/#project?')

  await OpenFolderRemote.openFolder()

  expect(Command.execute).toHaveBeenCalledWith('Workspace.setUri', 'file:///home/test/my%20folder/%23project%3F')
})

test('openFolder - canceled', async () => {
  prompt.mockResolvedValue('')

  await OpenFolderRemote.openFolder()

  expect(Command.execute).not.toHaveBeenCalled()
})
