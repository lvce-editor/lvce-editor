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

jest.unstable_mockModule('../src/parts/PromptTrace/PromptTrace.js', () => ({
  create: jest.fn(() => ({ id: 'trace-1' })),
  createId: jest.fn(() => 'trace-1'),
  write: jest.fn(async () => '/workspace/.agent-logs/trace-trace-1.json'),
}))

const Command = await import('../src/parts/Command/Command.js')
const Exit = await import('../src/parts/Exit/Exit.js')
const Process = await import('../src/parts/Process/Process.js')
const PromptMode = await import('../src/parts/PromptMode/PromptMode.js')
const PromptTrace = await import('../src/parts/PromptTrace/PromptTrace.js')

beforeEach(() => {
  jest.clearAllMocks()
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

test('parsePromptOptions - reads workspace sandbox and backend flags', () => {
  expect(
    PromptMode.parsePromptOptions([
      '/usr/bin/lvce',
      '--prompt=Fix the tests',
      '--allow-read',
      '.',
      '--allow-write=.',
      '--backend-url',
      'http://localhost:3000',
    ]),
  ).toEqual({
    allowReadRoot: '.',
    allowWriteRoot: '.',
    backendUrl: 'http://localhost:3000',
    prompt: 'Fix the tests',
  })
})

test('getPromptOptions - reads prompt mode options from the Electron argv', async () => {
  // @ts-ignore
  Process.getArgv.mockResolvedValue(['/usr/bin/lvce', '--prompt', 'Inspect files', '--allow-read', '.'])

  await expect(PromptMode.getPromptOptions()).resolves.toEqual({
    allowReadRoot: '.',
    prompt: 'Inspect files',
  })
})

test('run - executes the headless chat and exits successfully', async () => {
  // @ts-ignore
  Command.execute.mockResolvedValueOnce({
    sessionId: 'session-1',
    status: 'completed',
    task: {
      events: [
        { text: 'Working', type: 'assistant-message' },
        { status: 'completed', type: 'status' },
        { text: 'Done', type: 'assistant-message' },
      ],
    },
    trace: [],
  })

  await PromptMode.run('Fix the tests')

  expect(Command.execute).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'chat2.runPrompt', 'Fix the tests')
  expect(Process.writeStdout).toHaveBeenCalledWith('Done\n')
  expect(Process.writeStderr).not.toHaveBeenCalled()
  expect(PromptTrace.write).toHaveBeenCalledWith({ id: 'trace-1' })
  expect(Exit.exit).toHaveBeenCalledWith(0)
})

test('run - passes a read-only workspace sandbox to headless chat', async () => {
  // @ts-ignore
  Command.execute.mockResolvedValueOnce({
    sessionId: 'session-1',
    status: 'completed',
    task: { events: [] },
    trace: [],
  })

  await PromptMode.run({ allowReadRoot: '.', prompt: 'Inspect the tests' })

  const fileSystemAccess = {
    allowRead: true,
    allowWrite: false,
    root: '.',
  }
  expect(Command.execute).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'chat2.runPrompt', 'Inspect the tests', undefined, fileSystemAccess)
  expect(PromptTrace.create).toHaveBeenCalledWith(expect.objectContaining({ fileSystemAccess }))
  expect(Exit.exit).toHaveBeenCalledWith(0)
})

test('run - makes workspace write access imply read access', async () => {
  // @ts-ignore
  Command.execute.mockResolvedValueOnce({
    sessionId: 'session-1',
    status: 'completed',
    task: { events: [] },
    trace: [],
  })

  await PromptMode.run({ allowWriteRoot: '.', prompt: 'Fix the tests' })

  expect(Command.execute).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'chat2.runPrompt', 'Fix the tests', undefined, {
    allowRead: true,
    allowWrite: true,
    root: '.',
  })
})

test('run - rejects sandbox roots outside the workspace', async () => {
  await PromptMode.run({ allowReadRoot: '/tmp', prompt: 'Inspect files' })

  expect(Command.execute).not.toHaveBeenCalled()
  expect(Process.writeStderr).toHaveBeenCalledWith('--allow-read currently only supports the workspace root "."\n')
  expect(Exit.exit).toHaveBeenCalledWith(1)
})

test('run - reports failures and exits unsuccessfully', async () => {
  // @ts-ignore
  Command.execute.mockResolvedValue({
    error: 'Model request failed',
    sessionId: 'session-1',
    status: 'failed',
    trace: [],
  })

  await PromptMode.run('Fix the tests')

  expect(Process.writeStderr).toHaveBeenCalledWith('Model request failed\n')
  expect(Process.writeStderr).toHaveBeenCalledWith('Trace: /workspace/.agent-logs/trace-trace-1.json\n')
  expect(Process.writeStdout).not.toHaveBeenCalled()
  expect(Exit.exit).toHaveBeenCalledWith(1)
})

test('run - reports trace write failures and exits unsuccessfully', async () => {
  // @ts-ignore
  Command.execute.mockResolvedValue({
    sessionId: 'session-1',
    status: 'completed',
    task: { events: [] },
    trace: [],
  })
  // @ts-ignore
  PromptTrace.write.mockRejectedValue(new Error('Workspace is read-only'))

  await PromptMode.run('Fix the tests')

  expect(Process.writeStderr).toHaveBeenCalledWith('Failed to write agent trace: Workspace is read-only\n')
  expect(Exit.exit).toHaveBeenCalledWith(1)
})
