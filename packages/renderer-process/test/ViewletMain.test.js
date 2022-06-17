/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Main from '../src/parts/Viewlet/ViewletMain.js'
import * as Layout from '../src/parts/Layout/Layout.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

beforeEach(async () => {
  Layout.state.$Main = document.createElement('div')
  await Viewlet.load('EditorPlainText')
  // Main.state.$MainContent = undefined
  // Main.state.$MainTabs = undefined
})

test.skip('openViewlet', async () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  expect(Layout.state.$Main.innerHTML).toBe(
    '<div class="MainTabs"><div class="MainTab" title="test://sample.txt">sample.txt</div></div><div id="MainContent"><div class="Viewlet" data-viewlet-id="EditorText">loading...</div></div>'
  )
})

test.skip('openViewlet, openAnotherTab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  Main.openAnotherTab('sample2.txt', 'test://sample2.txt', 0)
  expect(Layout.state.$Main.innerHTML).toBe(
    '<div class="MainTabs"><div class="MainTab" title="test://sample.txt">sample.txt</div><div class="MainTab" title="test://sample2.txt">sample2.txt</div></div><div id="MainContent"><div class="Viewlet" data-viewlet-id="EditorText">loading...</div></div>'
  )
})

test.skip('openViewlet, openAnotherTab, focusAnotherTab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  Main.openAnotherTab('sample2.txt', 'test://sample2.txt', 0)
  Main.openAnotherTab('sample3.txt', 'test://sample3.txt', 1)
  Main.focusAnotherTab(2, 0)
  expect(Layout.state.$Main.innerHTML).toBe(
    '<div class="MainTabs"><div class="MainTab" title="test://sample.txt" aria-selected="true">sample.txt</div><div class="MainTab" title="test://sample2.txt">sample2.txt</div><div class="MainTab" title="test://sample3.txt">sample3.txt</div></div><div id="MainContent"><div class="Viewlet" data-viewlet-id="EditorText">loading...</div></div>'
  )
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
  RendererWorker.state.send = jest.fn()
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  state.$MainTabs.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([100, 0])
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
  RendererWorker.state.send = jest.fn()
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    button: 1,
    cancelable: true,
  })
  state.$MainTabs.children[0].dispatchEvent(event)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([99, 0])
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
  RendererWorker.state.send = jest.fn()
  state.$MainTabs.children[0].dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, button: 2, cancelable: true })
  )
  expect(RendererWorker.state.send).not.toHaveBeenCalled()
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
  RendererWorker.state.send = jest.fn()
  state.$MainTabs.children[0].dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 15,
      clientY: 30,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([95, 0, 15, 30])
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
  RendererWorker.state.send = jest.fn()
  const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  state.$MainTabs.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.state.send).not.toHaveBeenCalled()
})

// TODO test closeAllViewlets

test('closeOthers - keep first tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeOthers(state, 0, 0)
  expect(state.$MainTabs.children).toHaveLength(1)
  expect(state.$MainTabs.firstChild).toBe($Tab1)
})

test('closeOthers - keep middle tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeOthers(state, 1, 1)
  expect(state.$MainTabs.children).toHaveLength(1)
  expect(state.$MainTabs.firstChild).toBe($Tab2)
})

test('closeOthers - keep last tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeOthers(state, 2, 2)
  expect(state.$MainTabs.children).toHaveLength(1)
  expect(state.$MainTabs.firstChild).toBe($Tab3)
})

test('closeTabsRight - first tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeTabsRight(state, 0)
  expect(state.$MainTabs.children).toHaveLength(1)
  expect(state.$MainTabs.firstChild).toBe($Tab1)
})

test('closeTabsRight - middle tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeTabsRight(state, 1)
  expect(state.$MainTabs.children).toHaveLength(2)
  expect(state.$MainTabs.children[0]).toBe($Tab1)
  expect(state.$MainTabs.children[1]).toBe($Tab2)
})

test('closeTabsRight - last tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeTabsRight(state, 2)
  expect(state.$MainTabs.children).toHaveLength(3)
})

test('closeTabsLeft - first tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeTabsLeft(state, 0)
  expect(state.$MainTabs.children).toHaveLength(3)
})

test('closeTabsLeft - middle tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeTabsLeft(state, 1)
  expect(state.$MainTabs.children).toHaveLength(2)
  expect(state.$MainTabs.children[0]).toBe($Tab2)
  expect(state.$MainTabs.children[1]).toBe($Tab3)
})

test('closeTabsLeft - last tab', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tab2 = document.createElement('div')
  const $Tab3 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1, $Tab2, $Tab3)
  state.$MainTabs = $Tabs
  Main.closeTabsLeft(state, 2)
  expect(state.$MainTabs.children).toHaveLength(1)
  expect(state.$MainTabs.children[0]).toBe($Tab3)
})
