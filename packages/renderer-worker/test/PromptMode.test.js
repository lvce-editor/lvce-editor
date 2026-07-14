import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Exit/Exit.js', () => ({
  exit: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Process/Process.js', () => ({
  getArgv: jest.fn(),
  writeStderr: jest.fn(),
  writeStdout: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const Exit = await import('../src/parts/Exit/Exit.js')
const Process = await import('../src/parts/Process/Process.js')
const PromptMode = await import('../src/parts/PromptMode/PromptMode.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('parsePrompt - separate value', () => {
  expect(PromptMode.parsePrompt(['/usr/bin/lvce', '--prompt', 'Fix the tests'])).toBe('Fix the tests')
})

test('parsePrompt - equals value', () => {
  expect(PromptMode.parsePrompt(['/usr/bin/lvce', '--prompt=Fix the tests'])).toBe('Fix the tests')
})

test('parsePrompt - absent', () => {
  expect(PromptMode.parsePrompt(['/usr/bin/lvce', '.'])).toBeUndefined()
})

test('getPrompt - reads the Electron argv', async () => {
  // @ts-ignore
  Process.getArgv.mockResolvedValue(['/usr/bin/lvce', '--prompt', 'Fix the tests'])
  await expect(PromptMode.getPrompt()).resolves.toBe('Fix the tests')
})

test('run - executes the headless chat and exits successfully', async () => {
  // @ts-ignore
  Command.execute.mockResolvedValueOnce('session-1')
  // @ts-ignore
  Command.execute.mockResolvedValueOnce({
    events: [
      { text: 'Working', type: 'assistant-message' },
      { status: 'completed', type: 'status' },
      { text: 'Done', type: 'assistant-message' },
    ],
  })

  await PromptMode.run('Fix the tests')

  expect(Command.execute).toHaveBeenNthCalledWith(1, 'ExtensionHost.executeCommand', 'chat2.createSession')
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'ExtensionHost.executeCommand', 'chat2.sendMessage', 'Fix the tests')
  expect(Process.writeStdout).toHaveBeenCalledWith('Done\n')
  expect(Process.writeStderr).not.toHaveBeenCalled()
  expect(Exit.exit).toHaveBeenCalledWith(0)
})

test('run - reports failures and exits unsuccessfully', async () => {
  // @ts-ignore
  Command.execute.mockRejectedValue(new Error('Model request failed'))

  await PromptMode.run('Fix the tests')

  expect(Process.writeStderr).toHaveBeenCalledWith('Model request failed\n')
  expect(Process.writeStdout).not.toHaveBeenCalled()
  expect(Exit.exit).toHaveBeenCalledWith(1)
})
