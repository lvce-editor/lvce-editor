import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const executeCommand = jest.fn<(...args: unknown[]) => Promise<unknown>>()
jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostCommands.js', () => ({ executeCommand }))
const workspaceState = { workspaceUri: '' }
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/WorkspaceState/WorkspaceState.js', () => ({ state: workspaceState }))
const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')
const { getTerminalSpawnOptions } = await import('../src/parts/GetTerminalSpawnOptions/GetTerminalSpawnOptions.js')

beforeEach(() => {
  WorkspaceConnection.reset()
  workspaceState.workspaceUri = 'codespaces://test/work'
  invoke.mockReset()
  executeCommand.mockReset()
})

test('uses the remote shell without a local process connection', async () => {
  WorkspaceConnection.set(workspaceState.workspaceUri, 'codespaces.getWebSocketUrl', '', '', { command: 'bash', args: ['-i'] })
  await expect(getTerminalSpawnOptions()).resolves.toEqual({ command: 'bash', args: ['-i'] })
  expect(invoke).not.toHaveBeenCalled()
})

test('uses local shell discovery after leaving the remote workspace', async () => {
  WorkspaceConnection.set(workspaceState.workspaceUri, 'codespaces.getWebSocketUrl', '', '', { command: 'bash', args: ['-i'] })
  workspaceState.workspaceUri = 'file:///local'
  invoke.mockResolvedValue({ command: 'powershell.exe', args: [] })
  await expect(getTerminalSpawnOptions()).resolves.toEqual({ command: 'powershell.exe', args: [] })
  expect(invoke).toHaveBeenCalledWith('GetTerminalSpawnOptions.getTerminalSpawnOptions')
})

test('keeps local discovery for connections without explicit shell options', async () => {
  WorkspaceConnection.set(workspaceState.workspaceUri, 'remote.getWebSocketUrl')
  invoke.mockResolvedValue({ command: 'zsh', args: ['-i'] })
  await expect(getTerminalSpawnOptions()).resolves.toEqual({ command: 'zsh', args: ['-i'] })
})

test('does not retain or expose mutable shell arguments', async () => {
  const options = { command: 'bash', args: ['-i'] }
  WorkspaceConnection.set(workspaceState.workspaceUri, 'remote.getWebSocketUrl', '', '', options)
  options.args.push('caller mutation')
  const result = await getTerminalSpawnOptions()
  result.args.push('result mutation')
  await expect(getTerminalSpawnOptions()).resolves.toEqual({ command: 'bash', args: ['-i'] })
  WorkspaceConnection.reset()
  expect(WorkspaceConnection.getTerminalSpawnOptions()).toBeUndefined()
})

test.each([{ command: '', args: [] }, { command: 'bash', args: [42] }, { command: 'bash' }, null])(
  'rejects invalid remote shell options: %p',
  (options) => {
    // @ts-expect-error exercise invalid extension input
    expect(() => WorkspaceConnection.set(workspaceState.workspaceUri, 'remote.getWebSocketUrl', '', '', options)).toThrow(
      'Invalid remote terminal spawn options',
    )
  },
)

test('opens devcontainer terminals through the extension instead of discovering a host shell', async () => {
  workspaceState.workspaceUri = 'devcontainers:///abc123'
  const options = { command: '/usr/bin/node', args: ['devcontainer.js', 'exec', 'sh'], cwd: '/host/project' }
  executeCommand.mockResolvedValue(options)
  await expect(getTerminalSpawnOptions()).resolves.toEqual(options)
  expect(executeCommand).toHaveBeenCalledWith('devcontainer.getTerminalSpawnOptions', workspaceState.workspaceUri, '')
  expect(invoke).not.toHaveBeenCalled()
})

test('does not fall back to a host shell when the container is stopped', async () => {
  workspaceState.workspaceUri = 'devcontainers:///abc123'
  executeCommand.mockRejectedValue(new Error('Devcontainer is not running'))
  await expect(getTerminalSpawnOptions()).rejects.toThrow('Devcontainer is not running')
  expect(invoke).not.toHaveBeenCalled()
})

test('passes an Explorer directory to the container terminal resolver', async () => {
  workspaceState.workspaceUri = 'devcontainers:///abc123'
  const cwd = 'devcontainers:///abc123/src'
  await getTerminalSpawnOptions(cwd)
  expect(executeCommand).toHaveBeenCalledWith('devcontainer.getTerminalSpawnOptions', workspaceState.workspaceUri, cwd)
})
