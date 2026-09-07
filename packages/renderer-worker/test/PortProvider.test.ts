import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<any>()
// The renderer worker uses its local worker launcher rather than rpc-registry.
// eslint-disable-next-line jest/no-restricted-jest-methods
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke }))
const { getPorts } = await import('../src/parts/PortProvider/PortProvider.ts')

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
