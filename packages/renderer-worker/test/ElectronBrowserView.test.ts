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
const ElectronBrowserViewIpc = await import('../src/parts/ElectronBrowserView/ElectronBrowserView.ipc.js')
const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')

test('registers the audio state handler with the IPC module', () => {
  expect(ElectronBrowserViewIpc.Commands.handleAudioStateChanged).toBe(ElectronBrowserView.handleAudioStateChanged)
})

test('forwards web contents audio state changes through the global event bus', async () => {
  const listener = jest.fn()
  GlobalEventBus.addListener('browser-view-audio-state-changed', listener)

  await ElectronBrowserView.handleAudioStateChanged(12, true)

  expect(listener).toHaveBeenCalledWith(12, true)
})

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

test('serializes web contents events in arrival order', async () => {
  const calls: string[] = []
  let finishNavigation = () => {}
  const navigationFinished = new Promise<void>((resolve) => {
    finishNavigation = resolve
  })
  GlobalEventBus.addListener('browser-view-did-navigate', async () => {
    calls.push('navigation-start')
    await navigationFinished
    calls.push('navigation-end')
  })
  GlobalEventBus.addListener('browser-view-page-favicon-updated', () => {
    calls.push('favicon')
  })

  const navigation = ElectronBrowserView.handleDidNavigate(12, 'https://example.com')
  const favicon = ElectronBrowserView.handlePageFaviconUpdated(12, ['data:image/x-icon;base64,AAEC'])
  await Promise.resolve()

  expect(calls).toEqual(['navigation-start'])
  finishNavigation()
  await Promise.all([navigation, favicon])
  expect(calls).toEqual(['navigation-start', 'navigation-end', 'favicon'])
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
