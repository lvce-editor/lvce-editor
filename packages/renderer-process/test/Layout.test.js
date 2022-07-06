/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const Layout = await import('../src/parts/Layout/Layout.js')

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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Layout.handleResize', {
    windowWidth: 1024,
    windowHeight: 768,
    titleBarHeight: 0,
  })
})

test('event - move sash', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    1,
    'Layout.handleSashPointerDown',
    'SideBar'
  )
  // TODO make it possible to test with custom x/y position
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    2,
    'Layout.handleSashPointerMove',
    0,
    0
  )
})
