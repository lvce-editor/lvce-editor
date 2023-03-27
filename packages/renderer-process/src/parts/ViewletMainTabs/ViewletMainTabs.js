import * as ViewletMainTabEvents from './ViewletMainTabEvents.js'
import * as Tab from '../Tab/Tab.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'

export const create = () => {
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'Viewlet MainTabs'
  $MainTabs.role = AriaRoles.TabList
  $MainTabs.onmousedown = ViewletMainTabEvents.handleTabsMouseDown
  $MainTabs.oncontextmenu = ViewletMainTabEvents.handleTabsContextMenu
  $MainTabs.ondragstart = ViewletMainTabEvents.handleDragStart
  // TODO race condition: what if tab has already been closed?
  return {
    $Viewlet: $MainTabs,
  }
}

export const setTabs = (state, tabs) => {
  const { $Viewlet } = state
  for (const tab of tabs) {
    const $Tab = Tab.create(tab.label, tab.title, false)
    $Viewlet.append($Tab)
  }
}
