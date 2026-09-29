import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<readonly unknown[]>>()
// The renderer worker uses its local worker launcher rather than rpc-registry.
// eslint-disable-next-line jest/no-restricted-jest-methods
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke }))
const { forwardPort, getPorts, stopForwardPort } = await import('../src/parts/PortProvider/PortProvider.ts')

test('queries scheme providers and combines their ports', async () => {
  const port = { forwardedAddress: 'https://test-3000.app.github.dev/', port: 3000 }
  invoke.mockResolvedValueOnce([[port], []])
  expect(await getPorts('codespaces://test/app')).toEqual([port])
  expect(invoke).toHaveBeenLastCalledWith(
    'Extensions.executeProvidersByEvent',
    'onPorts:codespaces',
    'ExtensionApi.providePorts',
    'codespaces://test/app',
  )
})

test('queries providers in the owning application', async () => {
  invoke.mockResolvedValueOnce([])
  expect(await getPorts('codespaces://test/app', 'preview')).toEqual([])
  expect(invoke).toHaveBeenLastCalledWith(
    'Extensions.invokeForApplication',
    'preview',
    'Extensions.executeProvidersByEvent',
    'onPorts:codespaces',
    'ExtensionApi.providePorts',
    'codespaces://test/app',
  )
})

test('ignores workspaces without a URI scheme', async () => {
  invoke.mockClear()
  expect(await getPorts('')).toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})

test('routes port forwarding to the owning Remote SSH application', async () => {
  invoke.mockResolvedValueOnce({ localPort: 3000 } as unknown as readonly unknown[])
  await expect(forwardPort('remote-ssh://host/work', 3000, 'preview')).resolves.toEqual({ localPort: 3000 })
  expect(invoke).toHaveBeenLastCalledWith(
    'Extensions.invokeForApplication',
    'preview',
    'Extensions.executeCommand',
    'remote-ssh.forwardPort',
    'remote-ssh://host/work',
    3000,
  )
})

test('routes stop forwarding to the owning Remote SSH application', async () => {
  invoke.mockResolvedValueOnce([])
  await stopForwardPort('remote-ssh://host/work', 3000, 'preview')
  expect(invoke).toHaveBeenLastCalledWith(
    'Extensions.invokeForApplication',
    'preview',
    'Extensions.executeCommand',
    'remote-ssh.stopForwardPort',
    'remote-ssh://host/work',
    3000,
  )
})

test('does not forward ports for non-SSH workspaces', async () => {
  invoke.mockClear()
  await expect(forwardPort('codespaces://host/work', 3000, 'preview')).rejects.toThrow('only available in Remote SSH')
  expect(invoke).not.toHaveBeenCalled()
})
