import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const create = jest.fn<(...args: unknown[]) => Promise<void>>()
const getPlatform = jest.fn(() => 2)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => ({ create }))
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ getPlatform }))
const ShellCommand = await import('../src/parts/ShellCommand/ShellCommand.js')
const { getQuickPickMenuEntries } = await import('../src/parts/ViewletLayout/ViewletLayoutMenuEntries.js')
const { commandMap } = await import('../src/parts/CommandMap/CommandMap.js')

beforeEach(() => {
  jest.clearAllMocks()
  getPlatform.mockReturnValue(2)
})

test('includes the supported shell command in the command palette', async () => {
  const entry = { id: 'ShellCommand.install', label: "Shell Command: Install 'lvce' command in PATH" }
  invoke.mockResolvedValue([entry])
  expect(await getQuickPickMenuEntries()).toContainEqual(entry)
  expect(invoke).toHaveBeenCalledWith('ShellCommand.getMenuEntries')
})

test.each([1, 3])('hides the command on web and remote platforms (%s)', async (platform) => {
  getPlatform.mockReturnValue(platform)
  expect(await ShellCommand.getMenuEntries()).toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})

test('command dispatch installs the launcher and reports success', async () => {
  invoke.mockResolvedValue('/usr/local/bin/lvce')
  await commandMap['ShellCommand.install']()
  expect(invoke).toHaveBeenCalledWith('ShellCommand.install')
  expect(create).toHaveBeenCalledWith('info', expect.stringContaining('/usr/local/bin/lvce'))
})

test('reports installation errors without claiming success', async () => {
  invoke.mockRejectedValue(new Error('User canceled'))
  await ShellCommand.install()
  expect(create).toHaveBeenCalledTimes(1)
  expect(create).toHaveBeenCalledWith('error', 'Failed to install shell command: User canceled')
})
