/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'

beforeAll(() => {
  // Workaround for drag event not being implemented in jsdom https://github.com/jsdom/jsdom/issues/2913
  // @ts-ignore
  globalThis.DragEvent = class extends Event {
    constructor(type, options) {
      super(type, options)
      // @ts-ignore
      this.dataTransfer = options.dataTransfer || {}
      // @ts-ignore
      this.dataTransfer.setData ||= () => {}
      // @ts-ignore
      this.dataTransfer.items ||= []
      this.dataTransfer.files ||= []
      this.clientX = options.clientX ?? 0
      this.clientY = options.clientY ?? 0
    }
  }
})
beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const Main = await import('../src/parts/ViewletMain/ViewletMain.js')

test('event - left click on tab', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  state.$MainTabs.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTabClick', 0, 0)
})

test('event - left click on tab label', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  const { $MainTabs } = state
  const $Label = $MainTabs.children[0].children[0]
  $Label.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTabClick', 0, 0)
})

test('event - middle click on tab', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    button: 1,
    cancelable: true,
  })
  const { $MainTabs } = state
  $MainTabs.children[0].dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTabClick', 1, 0)
})

test('event - right click on tab', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const { $MainTabs } = state
  $MainTabs.children[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 2, cancelable: true }))
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTabClick', 2, 0)
})

test('event - context menu on tab', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const { $MainTabs } = state
  $MainTabs.children[0].dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 15,
      clientY: 30,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTabContextMenu', 0, 15, 30)
})

test('event - context menu on tab label', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTabContextMenu', 0, 15, 30)
})

test('event - click on tabs', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  const { $MainTabs } = state
  $MainTabs.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(ExecuteViewletCommand.executeViewletCommand).not.toHaveBeenCalled()
})

test('event - dragover', () => {
  const state = Main.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  const event = new DragEvent('dragover', { bubbles: true, cancelable: true })
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  const { $MainTabs } = state
  $MainTabs.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleDragOver', 0, 0)
})
