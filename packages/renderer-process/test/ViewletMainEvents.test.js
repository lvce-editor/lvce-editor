/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

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

const Main = await import('../src/parts/ViewletMain/ViewletMain.js')
const Layout = await import('../src/parts/Layout/Layout.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

beforeEach(async () => {
  Layout.state.$Main = document.createElement('div')
  await Viewlet.load(ViewletModuleId.EditorPlainText)
  // Main.state.$MainContent = undefined
  // Main.state.$MainTabs = undefined
})

test('event - left click on tab', () => {
  const state = Main.create()
  Main.openViewlet(
    state,
    'EditorPlainText',
    'sample.txt',
    'test://sample.txt',
    -1
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  state.$MainTabs.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledWith('Main.handleTabClick', 0)
})

test('event - middle click on tab', () => {
  const state = Main.create()
  Main.openViewlet(
    state,
    'EditorPlainText',
    'sample.txt',
    'test://sample.txt',
    -1
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    button: 1,
    cancelable: true,
  })
  state.$MainTabs.children[0].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledWith('Main.closeEditor', 0)
})

test('event - right click on tab', () => {
  const state = Main.create()
  Main.openViewlet(
    state,
    'EditorPlainText',
    'sample.txt',
    'test://sample.txt',
    -1
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$MainTabs.children[0].dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, button: 2, cancelable: true })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - context menu on tab', () => {
  const state = Main.create()
  Main.openViewlet(
    state,
    'EditorPlainText',
    'sample.txt',
    'test://sample.txt',
    -1
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$MainTabs.children[0].dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 15,
      clientY: 30,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Main.handleTabContextMenu',
    0,
    15,
    30
  )
})

test('event - click on tabs', () => {
  const $MainTabOne = document.createElement('div')
  $MainTabOne.className = 'MainTab'
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'MainTabs'
  $MainTabs.append($MainTabOne)
  const state = {
    ...Main.create(),
    $MainTabs,
  }
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  state.$MainTabs.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})
