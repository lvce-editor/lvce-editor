import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({ assetDir: '/static' }))
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ getPlatform: () => 2 }))

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const { getExtensionViews } = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')
const invoke = jest.mocked(ExtensionManagementWorker.invoke)
const view = { extensionId: 'sample.extension', icon: '', id: 'sample.view', title: 'Sample', css: '/sample.css' }

beforeEach(() => {
  jest.resetAllMocks()
})

test('resolved views do not fetch the extension inventory', async () => {
  invoke.mockResolvedValue([view])

  await expect(getExtensionViews()).resolves.toEqual([view])
  expect(invoke.mock.calls).toEqual([['Extensions.getViews', '/static', 2]])
})

test('an empty view list does not fetch the extension inventory', async () => {
  invoke.mockResolvedValue([])

  await expect(getExtensionViews()).resolves.toEqual([])
  expect(invoke.mock.calls).toEqual([['Extensions.getViews', '/static', 2]])
})

test('missing CSS still resolves from the contributing manifest and preserves existing CSS', async () => {
  const missing = { ...view, id: 'sample.missing', css: '' }
  invoke.mockResolvedValueOnce([view, missing]).mockResolvedValueOnce([
    { id: 'sample.extension', path: 'https://example.com/sample', views: [{ id: 'sample.missing', css: 'media/view.css' }] },
  ])

  await expect(getExtensionViews()).resolves.toEqual([view, { ...missing, css: 'https://example.com/sample/media/view.css' }])
  expect(invoke.mock.calls).toEqual([
    ['Extensions.getViews', '/static', 2],
    ['Extensions.getAllExtensions', '/static', 2],
  ])
})

test('CSS fallback preserves application routing', async () => {
  const missing = { ...view, css: '' }
  invoke.mockResolvedValueOnce([missing]).mockResolvedValueOnce([])

  await expect(getExtensionViews('application-1')).resolves.toEqual([missing])
  expect(invoke.mock.calls).toEqual([
    ['Extensions.invokeForApplication', 'application-1', 'Extensions.getViews', '/static', 2],
    ['Extensions.invokeForApplication', 'application-1', 'Extensions.getAllExtensions', '/static', 2],
  ])
})

test('view changes are observed on the next request', async () => {
  invoke.mockResolvedValueOnce([view]).mockResolvedValueOnce([{ ...view, css: '/new.css' }])

  await expect(getExtensionViews()).resolves.toEqual([view])
  await expect(getExtensionViews()).resolves.toEqual([{ ...view, css: '/new.css' }])
})

test('view discovery errors are propagated', async () => {
  invoke.mockRejectedValueOnce(new Error('view discovery failed'))

  await expect(getExtensionViews()).rejects.toThrow('view discovery failed')
  expect(invoke).toHaveBeenCalledTimes(1)
})
