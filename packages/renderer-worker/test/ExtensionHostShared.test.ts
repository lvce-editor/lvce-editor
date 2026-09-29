import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionHostShared = await import('../src/parts/ExtensionHost/ExtensionHostShared.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const extensionManagementInvoke = ExtensionManagementWorker.invoke as any

beforeEach(() => {
  jest.resetAllMocks()
})

test('executeProviders invokes every isolated provider for the activation event', async () => {
  extensionManagementInvoke.mockResolvedValue([['first'], ['second']])

  const result = await ExtensionHostShared.executeProviders({
    event: 'onReferences:javascript',
    method: 'ExtensionHostReference.executeFileReferenceProvider',
    params: ['file:///test.js'],
    combineResults: (results) => results.flat(),
  })

  expect(result).toEqual(['first', 'second'])
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.executeProvidersByEvent',
    'onReferences:javascript',
    'ExtensionHostReference.executeFileReferenceProvider',
    'file:///test.js',
  )
})

test('executeProviders returns the configured fallback when no provider matches', async () => {
  extensionManagementInvoke.mockResolvedValue([])

  await expect(
    ExtensionHostShared.executeProviders({
      event: 'onStatusBarItem',
      method: 'ExtensionHostStatusBarItems.getStatusBarItems',
      params: [],
      noProviderFoundResult: [],
    }),
  ).resolves.toEqual([])
})

test('executeProvider returns the first isolated provider result', async () => {
  extensionManagementInvoke.mockResolvedValue(['first', 'second'])

  await expect(
    ExtensionHostShared.executeProvider({
      event: 'onDebug:node',
      method: 'ExtensionHostDebug.resume',
      params: ['node'],
      noProviderFoundMessage: 'no debug provider found',
    }),
  ).resolves.toBe('first')
})

test('executeProvider reports a missing provider', async () => {
  extensionManagementInvoke.mockResolvedValue([])

  await expect(
    ExtensionHostShared.executeProvider({
      event: 'onDebug:node',
      method: 'ExtensionHostDebug.resume',
      params: ['node'],
      noProviderFoundMessage: 'no debug provider found',
    }),
  ).rejects.toThrow(new Error('no debug provider found'))
})
