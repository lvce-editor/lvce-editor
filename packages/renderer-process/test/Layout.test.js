/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test, beforeAll } from '@jest/globals'

beforeAll(() => {
  // workaround for jsdom not supporting pointer events
  // @ts-ignore
  globalThis.PointerEvent = class extends Event {
    constructor(type, init) {
      super(type, init)
      this.clientX = init.clientX
      this.clientY = init.clientY
      this.pointerId = init.pointerId
    }
  }

  HTMLElement.prototype.setPointerCapture = () => {}
  HTMLElement.prototype.releasePointerCapture = () => {}

  Object.defineProperty(HTMLElement.prototype, 'onpointerdown', {
    set(fn) {
      this.addEventListener('pointerdown', fn)
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'onpointerup', {
    set(fn) {
      this.addEventListener('pointerup', fn)
    },
  })
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')

const Layout = await import('../src/parts/Layout/Layout.ts')

test.skip('base components', () => {
  // @ts-ignore
  expect(Layout.state.$ActivityBar).toBeInstanceOf(HTMLElement)
  // @ts-ignore
  expect(Layout.state.$StatusBar).toBeInstanceOf(HTMLElement)
  // @ts-ignore
  expect(Layout.state.$Panel).toBeInstanceOf(HTMLElement)
  // @ts-ignore
  expect(Layout.state.$Main).toBeInstanceOf(HTMLElement)
  // @ts-ignore
  expect(Layout.state.$TitleBar).toBeInstanceOf(HTMLElement)
  // @ts-ignore
  expect(Layout.state.$SideBar).toBeInstanceOf(HTMLElement)
})

test.skip('show', async () => {
  // TODO this should be different
  // TODO check attributes on elements
  // @ts-ignore
  Layout.show({
    'SideBar.visible': false,
    'SideBar.width': 100,
    'SideBar.position': 'left',
    'ActivityBar.visible': false,
    'Panel.visible': false,
    'Panel.height': 100,
    'TitleBar.visible': false,
    'StatusBar.visible': false,
  })
})

test.skip('update', () => {
  // @ts-ignore
  Layout.update({
    'SideBar.visible': false,
    'SideBar.width': 100,
    'SideBar.position': 'left',
    'ActivityBar.visible': false,
    'Panel.visible': false,
    'Panel.height': 100,
    'TitleBar.visible': false,
    'StatusBar.visible': false,
  })
})

test.skip('handleResize', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  Layout.show({
    'SideBar.visible': false,
    'SideBar.width': 100,
    'SideBar.position': 'left',
    'ActivityBar.visible': false,
    'Panel.visible': false,
    'Panel.height': 100,
    'TitleBar.visible': false,
    'StatusBar.visible': false,
  })
  window.dispatchEvent(
    new Event('resize', {
      bubbles: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Layout.handleResize', {
    windowWidth: 1024,
    windowHeight: 768,
    titleBarHeight: 0,
  })
})

test.skip('event - move sash', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const spy1 = jest.spyOn(HTMLElement.prototype, 'setPointerCapture')
  // @ts-ignore
  const spy2 = jest.spyOn(HTMLElement.prototype, 'releasePointerCapture')
  // @ts-ignore
  Layout.show({
    'SideBar.visible': true,
    'SideBar.width': 100,
    'SideBar.position': 'left',
    'ActivityBar.visible': false,
    'Panel.visible': false,
    'Panel.height': 100,
    'TitleBar.visible': false,
    'StatusBar.visible': false,
  })

  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 0,
    clientY: 0,
    pointerId: 1,
  })
  const pointerMoveEvent = new PointerEvent('pointermove', {
    bubbles: true,
    clientX: 0,
    clientY: 0,
    pointerId: 1,
  })
  const pointerUpEvent = new PointerEvent('pointerup', {
    bubbles: true,
    clientX: 0,
    clientY: 0,
    pointerId: 1,
  })
  // @ts-ignore
  const $SashSideBar = Layout.state.$SashSideBar
  $SashSideBar.dispatchEvent(pointerDownEvent)
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(1)

  $SashSideBar.dispatchEvent(pointerMoveEvent)
  $SashSideBar.dispatchEvent(pointerUpEvent)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(1)

  expect(RendererWorker.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.send).toHaveBeenNthCalledWith(1, 'Layout.handleSashPointerDown', 'SideBar')
  // TODO make it possible to test with custom x/y position
  expect(RendererWorker.send).toHaveBeenNthCalledWith(2, 'Layout.handleSashPointerMove', 0, 0)
})
