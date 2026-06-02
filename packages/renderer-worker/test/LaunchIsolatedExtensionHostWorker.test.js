import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import * as RendererProcessIpcParentType from '../src/parts/RendererProcessIpcParentType/RendererProcessIpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create: jest.fn(() => 42),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => PlatformType.Web),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const LaunchIsolatedExtensionHostWorker = await import('../src/parts/LaunchIsolatedExtensionHostWorker/LaunchIsolatedExtensionHostWorker.js')

test('launchIsolatedExtensionHostWorker', async () => {
  const port = {}
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockResolvedValue(undefined)

  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(
    port,
    'sample.extension',
    '/test/extension-host-worker/packages/e2e/fixtures/sample/main.js',
  )

  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith(
    'IpcParent.create',
    expect.objectContaining({
      method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
      name: 'Extension API: sample.extension',
      port,
      raw: true,
      url: '/test/extension-host-worker/packages/e2e/fixtures/sample/main.js',
    }),
  )
})
