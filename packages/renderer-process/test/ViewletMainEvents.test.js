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
      send: jest.fn(),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const Main = await import('../src/parts/ViewletMain/ViewletMain.js')

test('event - left click on tab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  state.$MainTabs.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledWith('Main.handleTabClick', 0)
})

test('event - left click on tab label', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  const { $MainTabs } = state
  const $Label = $MainTabs.children[0].children[0]
  $Label.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledWith('Main.handleTabClick', 0)
})

test('event - middle click on tab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    button: 1,
    cancelable: true,
  })
  const { $MainTabs } = state
  $MainTabs.children[0].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledWith('Main.closeEditor', 0)
})

test('event - right click on tab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const { $MainTabs } = state
  $MainTabs.children[0].dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, button: 2, cancelable: true })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - context menu on tab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const { $MainTabs } = state
  $MainTabs.children[0].dispatchEvent(
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

test('event - context menu on tab label', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const { $MainTabs } = state
  const $Label = $MainTabs.children[0].children[0]
  $Label.dispatchEvent(
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
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  const { $MainTabs } = state
  $MainTabs.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})
