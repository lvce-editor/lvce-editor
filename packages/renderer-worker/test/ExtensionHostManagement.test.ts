import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/GetExtensionAbsolutePath/GetExtensionAbsolutePath.js', () => {
  return {
    getExtensionAbsolutePath: jest.fn((id) => {
      return `/extensions/${id}/main.js`
    }),
  }
})

jest.unstable_mockModule('../src/parts/Origin/Origin.js', () => {
  return {
    origin: 'https://example.com',
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => {
      return 'test-platform'
    }),
  }
})

const ExtensionHostManagement = await import('../src/parts/ExtensionHostManagement/ExtensionHostManagement.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const ExtensionMetaState = await import('../src/parts/ExtensionMetaState/ExtensionMetaState.js')
const invokeMock = ExtensionManagementWorker.invoke as any

beforeEach(() => {
  ExtensionHostManagement.state.activatingExtensions = Object.create(null)
  ExtensionHostManagement.state.runningExtensions = Object.create(null)
  ExtensionMetaState.state.webExtensions = []
})

test('activateByEvent activates newly added matching extension on repeated event', async () => {
  const builtinExtension = {
    id: 'builtin.source-control',
    activation: ['onStatusBarItem'],
    isWeb: false,
    builtin: true,
    path: '/builtin/source-control',
    browser: 'main.js',
    status: 'resolved',
  }
  const dynamicExtension = {
    id: 'dynamic.source-control',
    activation: ['onStatusBarItem'],
    isWeb: true,
    builtin: false,
    path: '/dynamic/source-control',
    browser: 'main.js',
    status: 'resolved',
  }

  // @ts-ignore
  invokeMock.mockImplementation(async (method, ...params) => {
    const typedParams = params as any[]
    switch (method) {
      case 'Extensions.getAllExtensions':
        return [builtinExtension]
      case 'Extensions.activate3':
        return {
          extensionId: typedParams[0].id,
        }
      default:
        throw new Error(`unexpected method: ${method}`)
    }
  })

  await ExtensionHostManagement.activateByEvent('onStatusBarItem', '/asset', 'test-platform')

  ExtensionMetaState.state.webExtensions.push(dynamicExtension)

  await ExtensionHostManagement.activateByEvent('onStatusBarItem', '/asset', 'test-platform')

  expect(invokeMock).toHaveBeenCalledTimes(4)
  expect(invokeMock).toHaveBeenNthCalledWith(1, 'Extensions.getAllExtensions', '/asset', 'test-platform')
  expect(invokeMock.mock.calls[1][0]).toBe('Extensions.activate3')
  expect(invokeMock.mock.calls[1][1]).toBe(builtinExtension)
  expect(invokeMock.mock.calls[1][3]).toBe('onStatusBarItem')
  expect(invokeMock).toHaveBeenNthCalledWith(3, 'Extensions.getAllExtensions', '/asset', 'test-platform')
  expect(invokeMock.mock.calls[3][0]).toBe('Extensions.activate3')
  expect(invokeMock.mock.calls[3][1]).toBe(dynamicExtension)
  expect(invokeMock.mock.calls[3][3]).toBe('onStatusBarItem')
})

test('activateByEvent none waits for inflight activations', async () => {
  let resolveActivation: ((value?: any) => void) | undefined
  const activationPromise = new Promise<any>((resolve) => {
    resolveActivation = resolve
  })
  const builtinExtension = {
    id: 'builtin.source-control',
    activation: ['onStatusBarItem'],
    isWeb: false,
    builtin: true,
    path: '/builtin/source-control',
    browser: 'main.js',
    status: 'resolved',
  }

  // @ts-ignore
  invokeMock.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'Extensions.getAllExtensions':
        return [builtinExtension]
      case 'Extensions.activate3':
        return activationPromise
      default:
        throw new Error(`unexpected method: ${method}`)
    }
  })

  const pendingActivation = ExtensionHostManagement.activateByEvent('onStatusBarItem', '/asset', 'test-platform')

  const waitForNone = ExtensionHostManagement.activateByEvent('none', '/asset', 'test-platform')

  resolveActivation?.()

  await expect(waitForNone).resolves.toEqual([undefined])
  await pendingActivation
})

test('handleExtensionStateChanged disables a dynamic extension and forgets its activation state', () => {
  ExtensionHostManagement.state.activatingExtensions['sample.extension'] = Promise.resolve()
  ExtensionHostManagement.state.runningExtensions['sample.extension'] = true
  ExtensionHostManagement.state.runningExtensions['sample.other'] = true
  ExtensionMetaState.state.webExtensions = [{ id: 'sample.extension' }, { id: 'sample.other' }]

  ExtensionHostManagement.handleExtensionStateChanged('sample.extension', true)

  expect(ExtensionHostManagement.state.activatingExtensions['sample.extension']).toBeUndefined()
  expect(ExtensionHostManagement.state.runningExtensions['sample.extension']).toBeUndefined()
  expect(ExtensionHostManagement.state.runningExtensions['sample.other']).toBe(true)
  expect(ExtensionMetaState.state.webExtensions).toEqual([{ disabled: true, id: 'sample.extension' }, { id: 'sample.other' }])
})

test('handleExtensionStateChanged re-enables a dynamic extension', () => {
  ExtensionMetaState.state.webExtensions = [{ disabled: true, id: 'sample.extension' }]

  ExtensionHostManagement.handleExtensionStateChanged('sample.extension', false)

  expect(ExtensionMetaState.state.webExtensions).toEqual([{ disabled: false, id: 'sample.extension' }])
})

test('disabled dynamic extension can activate again after it is re-enabled', async () => {
  const extension = {
    activation: ['onStatusBarItem'],
    browser: 'main.js',
    builtin: false,
    id: 'sample.extension',
    isWeb: true,
    path: '/dynamic/sample.extension',
    status: 'resolved',
  }
  ExtensionMetaState.state.webExtensions = [extension]
  // @ts-ignore
  invokeMock.mockImplementation(async (method) => {
    if (method === 'Extensions.getAllExtensions') {
      return []
    }
    if (method === 'Extensions.activate3') {
      return undefined
    }
    throw new Error(`unexpected method: ${method}`)
  })

  await ExtensionHostManagement.activateByEvent('onStatusBarItem', '/asset', 'test-platform')
  ExtensionHostManagement.handleExtensionStateChanged('sample.extension', true)
  await ExtensionHostManagement.activateByEvent('onStatusBarItem', '/asset', 'test-platform')
  ExtensionHostManagement.handleExtensionStateChanged('sample.extension', false)
  await ExtensionHostManagement.activateByEvent('onStatusBarItem', '/asset', 'test-platform')

  expect(invokeMock.mock.calls.filter(([method]) => method === 'Extensions.activate3')).toHaveLength(2)
})
