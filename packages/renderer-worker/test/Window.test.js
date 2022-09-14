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
const ElectronWindow = await import(
  '../src/parts/ElectronWindow/ElectronWindow.js'
)

// TODO test for platform web and platform electron
test.skip('reload', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Window.reload()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8080)
})

test('minimize - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  const Window = await import('../src/parts/Window/Window.js')
  // @ts-ignore
  ElectronWindow.minimize.mockImplementation(() => {})
  await Window.minimize()
  expect(ElectronWindow.minimize).toHaveBeenCalledTimes(1)
})

test('maximize - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  const Window = await import('../src/parts/Window/Window.js')
  // @ts-ignore
  ElectronWindow.maximize.mockImplementation(() => {})
  await Window.maximize()
  expect(ElectronWindow.maximize).toHaveBeenCalledTimes(1)
})

test('unmaximize - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  const Window = await import('../src/parts/Window/Window.js')
  // @ts-ignore
  ElectronWindow.unmaximize.mockImplementation(() => {})
  await Window.unmaximize()
  expect(ElectronWindow.unmaximize).toHaveBeenCalledTimes(1)
})

test('close - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  const Window = await import('../src/parts/Window/Window.js')
  // @ts-ignore
  ElectronWindow.close.mockImplementation(() => {})
  await Window.close()
  expect(ElectronWindow.close).toHaveBeenCalledTimes(1)
})

test('setTitle', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'web',
    }
  })
  const Window = await import('../src/parts/Window/Window.js')
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
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  const Window = await import('../src/parts/Window/Window.js')
  // @ts-ignore
  ElectronWindow.openNew.mockImplementation(() => {})
  await Window.openNew()
  expect(ElectronWindow.openNew).toHaveBeenCalledTimes(1)
})

test('open - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  const Window = await import('../src/parts/Window/Window.js')
  // @ts-ignore
  await expect(
    Window.open('http://localhost:3000', '_blank', '')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('open - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const Window = await import('../src/parts/Window/Window.js')
  await Window.open('http://localhost:3000', '_blank', '')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Window.open',
    'http://localhost:3000',
    '_blank',
    ''
  )
})
