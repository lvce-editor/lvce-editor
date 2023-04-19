import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as Tab from '../Tab/Tab.js'
import * as ViewletMainTabEvents from './ViewletMainTabEvents.js'

export const create = () => {
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'Viewlet MainTabs'
  $MainTabs.role = AriaRoles.TabList
  // TODO race condition: what if tab has already been closed?
  return {
    $Viewlet: $MainTabs,
    $MainTabs,
  }
}

export const attachEvents = (state) => {
  const { $MainTabs } = state
  $MainTabs.onmousedown = ViewletMainTabEvents.handleTabsMouseDown
  $MainTabs.oncontextmenu = ViewletMainTabEvents.handleTabsContextMenu
  $MainTabs.ondragstart = ViewletMainTabEvents.handleDragStart
}

export const setTabs = (state, tabs) => {
  const { $Viewlet } = state
  const $$Tabs = []
  for (const tab of tabs) {
    const $Tab = Tab.create(tab.label, tab.title, true)
    $$Tabs.push($Tab)
  }
  $Viewlet.replaceChildren(...$$Tabs)
}

export const setDirty = (state, index, dirty) => {
  Assert.number(index)
  Assert.boolean(dirty)
  const { $MainTabs } = state
  if (dirty) {
    $MainTabs.children[index].classList.add('Dirty')
  } else {
    $MainTabs.children[index].classList.remove('Dirty')
  }
}

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $Viewlet } = state
  if (oldFocusedIndex !== -1) {
    $Viewlet.children[oldFocusedIndex].ariaSelected = false
  }
  $Viewlet.children[newFocusedIndex].ariaSelected = true
}
