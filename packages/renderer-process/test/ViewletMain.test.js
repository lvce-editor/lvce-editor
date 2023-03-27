/**
 * @jest-environment jsdom
 */
import * as Main from '../src/parts/ViewletMain/ViewletMain.js'

beforeEach(async () => {
  // await Viewlet.load(ViewletModuleId.EditorPlainText)
  // Main.state.$MainContent = undefined
  // Main.state.$MainTabs = undefined
})

test.skip('openViewlet', async () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  expect(Layout.state.$Main.innerHTML).toBe(
    '<div class="MainTabs"><div class="MainTab" title="test://sample.txt">sample.txt</div></div><div id="MainContent"><div class="Viewlet">loading...</div></div>'
  )
})

test.skip('openViewlet, openAnotherTab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  Main.openAnotherTab('sample2.txt', 'test://sample2.txt', 0)
  expect(Layout.state.$Main.innerHTML).toBe(
    '<div class="MainTabs"><div class="MainTab" title="test://sample.txt">sample.txt</div><div class="MainTab" title="test://sample2.txt">sample2.txt</div></div><div id="MainContent"><div class="Viewlet">loading...</div></div>'
  )
})

test.skip('openViewlet, openAnotherTab, focusAnotherTab', () => {
  const state = Main.create()
  Main.openViewlet(state, 'EditorPlainText', 'sample.txt', 'test://sample.txt')
  Main.openAnotherTab('sample2.txt', 'test://sample2.txt', 0)
  Main.openAnotherTab('sample3.txt', 'test://sample3.txt', 1)
  Main.focusAnotherTab(2, 0)
  expect(Layout.state.$Main.innerHTML).toBe(
    '<div class="MainTabs"><div class="MainTab" title="test://sample.txt" aria-selected="true">sample.txt</div><div class="MainTab" title="test://sample2.txt">sample2.txt</div><div class="MainTab" title="test://sample3.txt">sample3.txt</div></div><div id="MainContent"><div class="Viewlet">loading...</div></div>'
  )
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

test('accessibility - viewlet should have a role of main', () => {
  const state = Main.create()
  const { $Viewlet } = state
  expect($Viewlet.role).toBe('main')
})

test('closeTabsLeft - highlightDragOver', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.append($Tab1)
  state.$MainTabs = $Tabs
  Main.highlightDragOver(state)
  expect($Tabs.classList.contains('DragOver')).toBe(true)
})

test('closeTabsLeft - stopHighlightDragOver', () => {
  const state = Main.create()
  const $Tab1 = document.createElement('div')
  const $Tabs = document.createElement('div')
  $Tabs.className = 'MainTabs DragOver'
  $Tabs.append($Tab1)
  state.$MainTabs = $Tabs
  Main.stopHighlightDragOver(state)
  expect($Tabs.classList.contains('DragOver')).toBe(false)
})
