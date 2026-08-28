import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  GlobalEventBus.state.listenerMap = Object.create(null)
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ElectronBrowserView = await import('../src/parts/ElectronBrowserView/ElectronBrowserView.js')
const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')

test('forwards web contents keybindings through the global event bus', async () => {
  const listener = jest.fn()
  GlobalEventBus.addListener('browser-view-key-binding', listener)

  await ElectronBrowserView.handleKeyBinding(12, 2050)

  expect(listener).toHaveBeenCalledWith(12, 2050)
})

test('forwards web contents context menus through the global event bus', async () => {
  const listener = jest.fn()
  const params = { linkURL: 'https://example.com', x: 10, y: 20 }
  GlobalEventBus.addListener('browser-view-context-menu', listener)

  await ElectronBrowserView.handleContextMenu(params)

  expect(listener).toHaveBeenCalledWith(params)
})

test.skip('createBrowserView - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(ElectronBrowserView.createBrowserView(0, [])).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('createBrowserView', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  await ElectronBrowserView.createBrowserView(0, [])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronBrowserView.createBrowserView', 0, [])
})
