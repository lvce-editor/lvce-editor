import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/TitleBarWorker/TitleBarWorker.js', () => ({
  invoke: jest.fn(),
}))

const TitleBarWorker = await import('../src/parts/TitleBarWorker/TitleBarWorker.js')
const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')
const TitleBarMenuOverlay = await import('../src/parts/ViewletTitleBar/TitleBarMenuOverlay.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows the title bar menu overlay', async () => {
  await TitleBarMenuOverlay.show()

  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('title-bar-menu')
})

test('hides the title bar menu overlay after the menu has rendered closed', async () => {
  await TitleBarMenuOverlay.afterRender({ titleBarMenuOpen: true }, { titleBarMenuOpen: false })

  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('title-bar-menu')
})

test('keeps the title bar menu overlay while a menu remains open', async () => {
  await TitleBarMenuOverlay.afterRender({ titleBarMenuOpen: true }, { titleBarMenuOpen: true })

  expect(SimpleBrowserOverlay.hide).not.toHaveBeenCalled()
})

test('reconciles direct menu events before rendering and releases the overlay after closing', async () => {
  jest.mocked(TitleBarWorker.invoke).mockResolvedValueOnce({ isMenuOpen: true }).mockResolvedValueOnce({ isMenuOpen: false })
  const closed = { uid: 7, titleBarMenuOpen: false }
  const opened = await TitleBarMenuOverlay.reconcile(closed)
  expect(opened.titleBarMenuOpen).toBe(true)
  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('title-bar-menu')
  await TitleBarMenuOverlay.afterRender(closed, opened)
  expect(SimpleBrowserOverlay.hide).not.toHaveBeenCalled()

  const next = await TitleBarMenuOverlay.reconcile(opened)
  expect(next.titleBarMenuOpen).toBe(false)
  expect(SimpleBrowserOverlay.hide).not.toHaveBeenCalled()
  await TitleBarMenuOverlay.afterRender(opened, next)
  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('title-bar-menu')
  expect(TitleBarWorker.invoke).toHaveBeenCalledWith('TitleBar.getComponentState', 7)
})

test('the direct title-bar render pipeline reconciles menu state and exports its cleanup hook', async () => {
  const { createWorkerViewletWithDependencies } = await import('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js')
  const { getWorkerViewletAdapter } = await import('../src/parts/WorkerViewletAdapterMap/WorkerViewletAdapterMap.js')
  const { getWorkerViewletConfig } = await import('../src/parts/WorkerViewletConfig/WorkerViewletConfig.js')
  const TitleBar = await import('../src/parts/ViewletTitleBar/ViewletTitleBar.ipc.js')
  const invoke = jest.fn(async (method: string) => (method === 'TitleBar.diff3' ? [1] : []))
  const viewlet = createWorkerViewletWithDependencies({
    adapter: getWorkerViewletAdapter('titleBar'),
    config: getWorkerViewletConfig('titleBar'),
    worker: { invoke, restart: jest.fn() },
  })
  jest.mocked(TitleBarWorker.invoke).mockResolvedValueOnce({ isMenuOpen: true }).mockResolvedValueOnce({ isMenuOpen: false })
  const closed = { uid: 7, titleBarMenuOpen: false }
  const opened = await viewlet.Commands.__renderPending(closed)
  expect(opened.titleBarMenuOpen).toBe(true)
  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('title-bar-menu')
  const next = await viewlet.Commands.__renderPending(opened)
  expect(next.titleBarMenuOpen).toBe(false)
  expect(TitleBar.afterRender).toBe(TitleBarMenuOverlay.afterRender)
  await TitleBar.afterRender(opened, next)
  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('title-bar-menu')
})
