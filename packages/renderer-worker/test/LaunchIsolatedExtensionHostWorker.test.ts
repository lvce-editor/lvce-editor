import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import * as RendererProcessIpcParentType from '../src/parts/RendererProcessIpcParentType/RendererProcessIpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
  // @ts-ignore
  Id.create.mockReturnValue(42)
  LaunchIsolatedExtensionHostWorker.clear()
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create: jest.fn(() => 42),
  }
})

jest.unstable_mockModule('../src/parts/ContentSecurityPolicy/ContentSecurityPolicy.js', () => {
  return {
    set: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/IpcTrace/IpcTrace.js', () => {
  return {
    maybeCreateProxy: async ({ port }) => port,
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => PlatformType.Web),
  }
})

const ContentSecurityPolicy = await import('../src/parts/ContentSecurityPolicy/ContentSecurityPolicy.js')
const Id = await import('../src/parts/Id/Id.js')
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

test('launchIsolatedExtensionHostWorker - uses custom worker name', async () => {
  const port = {}
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockResolvedValue(undefined)

  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(
    port,
    'builtin.trello',
    '/test/trello/packages/extension/dist/trelloMain.js',
    'Trello Worker',
  )

  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith(
    'IpcParent.create',
    expect.objectContaining({
      method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
      name: 'Trello Worker',
      port,
      raw: true,
      url: '/test/trello/packages/extension/dist/trelloMain.js',
    }),
  )
})

test('launchIsolatedExtensionHostWorker - applies the extension content security policy before launch', async () => {
  const port = {}
  // @ts-ignore
  ContentSecurityPolicy.set.mockResolvedValue(undefined)
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockResolvedValue(undefined)

  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(
    port,
    'builtin.language-features-nvmrc',
    'http://localhost:3000/remote/extensions/builtin.language-features-nvmrc/dist/languageFeaturesNvmrcMain.js',
    '',
    `default-src 'none'; connect-src https://nodejs.org; script-src 'self';`,
  )

  expect(ContentSecurityPolicy.set).toHaveBeenCalledWith(
    '/remote/extensions/builtin.language-features-nvmrc/dist/languageFeaturesNvmrcMain.js',
    `default-src 'none'; connect-src https://nodejs.org; script-src 'self';`,
  )
  // @ts-ignore
  expect(ContentSecurityPolicy.set.mock.invocationCallOrder[0]).toBeLessThan(RendererProcess.invokeAndTransfer.mock.invocationCallOrder[0])
})

test('getMemoryUsage returns memory attributed to the extension worker', async () => {
  const port = {}
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockResolvedValue(undefined)
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue({
    breakdown: [
      {
        attribution: [
          {
            scope: 'DedicatedWorkerGlobalScope',
            url: 'https://example.test/test/extension-host-worker/packages/e2e/fixtures/sample/main.js',
          },
        ],
        bytes: 2048,
      },
    ],
  })
  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(
    port,
    'sample.extension',
    '/test/extension-host-worker/packages/e2e/fixtures/sample/main.js',
  )

  await expect(LaunchIsolatedExtensionHostWorker.getMemoryUsage('sample.extension')).resolves.toBe(2048)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Performance.measureUserAgentSpecificMemory')
})

test('getMemoryUsage returns zero when the extension worker is not running', async () => {
  await expect(LaunchIsolatedExtensionHostWorker.getMemoryUsage('sample.extension')).resolves.toBe(0)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('disposeIsolatedExtensionHostWorker terminates the renderer process worker', async () => {
  const port = {}
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockResolvedValue(undefined)
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(
    port,
    'sample.extension',
    '/test/extension-host-worker/packages/e2e/fixtures/sample/main.js',
  )

  await LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker('sample.extension')

  expect(RendererProcess.invoke).toHaveBeenCalledWith('IpcParent.dispose', 42)
})

test('disposeIsolatedExtensionHostWorker only disposes a worker once', async () => {
  const port = {}
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockResolvedValue(undefined)
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(
    port,
    'sample.extension',
    '/test/extension-host-worker/packages/e2e/fixtures/sample/main.js',
  )

  await LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker('sample.extension')
  await LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker('sample.extension')

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
})

test('disposal during security policy setup prevents worker creation', async () => {
  const gate = Promise.withResolvers<void>()
  jest.mocked(ContentSecurityPolicy.set).mockImplementationOnce(() => gate.promise)
  const close = jest.fn()
  const launch = LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker({ close }, 'preview', '/old.js', '', 'policy')
  const result = launch.catch((error: unknown) => error)
  await LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker('preview')
  gate.resolve()
  expect(await result).toEqual(expect.objectContaining({ message: 'Extension worker launch canceled: preview' }))
  expect(RendererProcess.invokeAndTransfer).not.toHaveBeenCalled()
  expect(close).toHaveBeenCalledTimes(1)
})

test('a late worker launch cannot overwrite or terminate a replacement', async () => {
  const started = Promise.withResolvers<void>()
  const gate = Promise.withResolvers<void>()
  jest.mocked(RendererProcess.invokeAndTransfer).mockImplementationOnce(async () => {
    started.resolve()
    await gate.promise
  })
  const old = LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker({}, 'preview', '/old.js')
  const result = old.catch((error: unknown) => error)
  await started.promise
  await LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker('preview')
  jest.mocked(Id.create).mockReturnValue(43)
  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker({}, 'preview', '/new.js')
  gate.resolve()
  expect(await result).toEqual(expect.objectContaining({ message: 'Extension worker launch canceled: preview' }))
  expect(RendererProcess.invoke).not.toHaveBeenCalledWith('IpcParent.dispose', 43)
  await LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker('preview')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('IpcParent.dispose', 43)
})

test('rejects duplicate live extension ids without replacing the first worker', async () => {
  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker({}, 'preview', '/first.js')
  await expect(LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker({}, 'preview', '/second.js')).rejects.toThrow('already exists')
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
})
