/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Layout from '../src/parts/Layout/Layout.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'

// beforeAll(() => {
//   // https://github.com/jsdom/jsdom/issues/2527
//   // @ts-ignore
//   globalThis.PointerEvent = class extends Event {
//     constructor(type, { x, y }) {
//       super(type)
//       this.x = x
//       this.y = y
//     }
//   }
// })

test.skip('base components', () => {
  expect(Layout.state.$ActivityBar).toBeInstanceOf(HTMLElement)
  expect(Layout.state.$StatusBar).toBeInstanceOf(HTMLElement)
  expect(Layout.state.$Panel).toBeInstanceOf(HTMLElement)
  expect(Layout.state.$Main).toBeInstanceOf(HTMLElement)
  expect(Layout.state.$TitleBar).toBeInstanceOf(HTMLElement)
  expect(Layout.state.$SideBar).toBeInstanceOf(HTMLElement)
})

test('show', async () => {
  // TODO this should be different
  // TODO check attributes on elements
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

test('update', () => {
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

test('handleResize', () => {
  RendererWorker.state.send = jest.fn()
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
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([
    'Layout.handleResize',
    { windowWidth: 1024, windowHeight: 768, titleBarHeight: 0 },
  ])
})

test('event - move sash', () => {
  RendererWorker.state.send = jest.fn()
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

  const pointerDownEvent = new MouseEvent('pointerdown', {
    bubbles: true,
  })
  const pointerMoveEvent = new MouseEvent('pointermove', {
    bubbles: true,
  })
  const pointerUpEvent = new MouseEvent('pointerup', {
    bubbles: true,
  })
  const $SashSideBar = Layout.state.$SashSideBar
  $SashSideBar.dispatchEvent(pointerDownEvent)
  const $Style = document.getElementById('SashStyle')
  expect($Style).toBeDefined()
  expect($Style.isConnected).toBe(true)
  $SashSideBar.dispatchEvent(pointerMoveEvent)
  $SashSideBar.dispatchEvent(pointerUpEvent)
  expect($Style.isConnected).toBe(false)
  expect(RendererWorker.state.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.state.send).toHaveBeenNthCalledWith(1, [
    'Layout.handleSashPointerDown',
    'SideBar',
  ])
  // TODO make it possible to test with custom x/y position
  expect(RendererWorker.state.send).toHaveBeenNthCalledWith(2, [
    'Layout.handleSashPointerMove',
    0,
    0,
  ])
})
