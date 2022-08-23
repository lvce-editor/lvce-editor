import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    get platform() {
      return jest.fn(() => {
        throw new Error('not implemented')
      })
    },
  }
})

jest.unstable_mockModule(
  '../src/parts/ElectronWindow/ElectronWindow.js',
  () => {
    return {
      toggleDevtools: jest.fn(() => {
        throw new Error('not implemented')
      }),
      minimize: jest.fn(() => {
        throw new Error('not implemented')
      }),
      maximize: jest.fn(() => {
        throw new Error('not implemented')
      }),
      unmaximize: jest.fn(() => {
        throw new Error('not implemented')
      }),
      close: jest.fn(() => {
        throw new Error('not implemented')
      }),
      openNew: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const ElectronWindow = await import(
  '../src/parts/ElectronWindow/ElectronWindow.js'
)
const Platform = await import('../src/parts/Platform/Platform.js')

const Window = await import('../src/parts/Window/Window.js')

// TODO test for platform web and platform electron
test.skip('reload', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Window.reload()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8080)
})

test('minimize', async () => {
  // @ts-ignore
  ElectronWindow.minimize.mockImplementation(() => {})
  await Window.minimize()
  expect(ElectronWindow.minimize).toHaveBeenCalledTimes(1)
})

test('maximize', async () => {
  // @ts-ignore
  ElectronWindow.maximize.mockImplementation(() => {})
  await Window.maximize()
  expect(ElectronWindow.maximize).toHaveBeenCalledTimes(1)
})

test('unmaximize', async () => {
  // @ts-ignore
  ElectronWindow.unmaximize.mockImplementation(() => {})
  await Window.unmaximize()
  expect(ElectronWindow.unmaximize).toHaveBeenCalledTimes(1)
})

test('close', async () => {
  // @ts-ignore
  ElectronWindow.close.mockImplementation(() => {})
  await Window.close()
  expect(ElectronWindow.close).toHaveBeenCalledTimes(1)
})

test('setTitle', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'web'
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Window.setTitle('test')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Window.setTitle', 'test')
})

test.skip('openNew - web', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'web'
  })
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await Window.openNew()
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
})

test('openNew - electron', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'electron'
  })
  // @ts-ignore
  ElectronWindow.openNew.mockImplementation(() => {})
  await Window.openNew()
  expect(ElectronWindow.openNew).toHaveBeenCalledTimes(1)
})
