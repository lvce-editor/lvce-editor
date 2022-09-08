import { jest } from '@jest/globals'
import * as Preferences from '../src/parts/Preferences/Preferences.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

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
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const Platform = await import('../src/parts/Platform/Platform.js')

const ServiceWorker = await import(
  '../src/parts/ServiceWorker/ServiceWorker.js'
)

test('hydrate', async () => {
  // @ts-ignore
  Platform.getPlatform.mockImplementation(() => {
    return PlatformType.Web
  })
  Preferences.state['serviceWorker.enabled'] = true
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ServiceWorker.hydrate()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    43725,
    '/serviceWorker.js'
  )
})

test('uninstall', async () => {
  // @ts-ignore
  Platform.getPlatform.mockImplementation(() => {
    return PlatformType.Web
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ServiceWorker.uninstall()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(42726)
})
