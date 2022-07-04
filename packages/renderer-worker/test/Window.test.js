import { jest } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.js'

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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

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
  SharedProcess.invoke.mockImplementation(() => {})
  await Window.minimize()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.windowMinimize')
})

test('maximize', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await Window.maximize()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.windowMaximize')
})

test('unmaximize', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await Window.unmaximize()
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.windowUnMaximize')
})

test('close', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await Window.close()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.windowClose')
})

test('setTitle', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Window.setTitle('test')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Window.setTitle', 'test')
})

test('openNew - web', async () => {
  Platform.state.getPlatform = () => {
    return 'web'
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await Window.openNew()
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
})

test('openNew - electron', async () => {
  Platform.state.getPlatform = () => {
    return 'electron'
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  await Window.openNew()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.windowOpenNew')
})
