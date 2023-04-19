/**
 * @jest-environment jsdom
 */
import * as Main from '../src/parts/ViewletMain/ViewletMain.js'

beforeEach(async () => {
  // await Viewlet.load(ViewletModuleId.EditorPlainText)
  // Main.state.$MainContent = undefined
  // Main.state.$MainTabs = undefined
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
