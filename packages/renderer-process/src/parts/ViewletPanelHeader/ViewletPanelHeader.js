import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as ViewletPanelHeaderEvents from './ViewletPanelHeaderEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
}

const create$PanelTab = (label, index) => {
  const $PanelTab = document.createElement('div')
  $PanelTab.className = 'PanelTab'
  // @ts-ignore
  $PanelTab.role = AriaRoles.Tab
  $PanelTab.textContent = label
  $PanelTab.id = `PanelTab-${index + 1}`
  return $PanelTab
}

export const create = () => {
  const $Tabs = document.createElement('div')
  $Tabs.className = 'PanelTabs'
  // @ts-ignore
  $Tabs.role = AriaRoles.TabList
  $Tabs.onmousedown = ViewletPanelHeaderEvents.handleClickTab
  $Tabs.tabIndex = -1

  const $ButtonClose = IconButton.create$Button(UiStrings.Close, Icon.Close)
  $ButtonClose.onclick = ViewletPanelHeaderEvents.handleClickClose

  const $PanelToolBar = document.createElement('div')
  $PanelToolBar.className = 'PanelToolBar'
  // @ts-ignore
  $PanelToolBar.role = AriaRoles.ToolBar
  $PanelToolBar.append($ButtonClose)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet PanelHeader'
  $Viewlet.append($Tabs, $PanelToolBar)

  return {
    $PanelHeader: $Viewlet,
    $Viewlet,
    $Tabs,
  }
}

export const setTabs = (state, tabs) => {
  const { $Tabs } = state
  $Tabs.append(...tabs.map(create$PanelTab))
}

export const setSelectedIndex = (state, oldIndex, newIndex) => {
  const { $Tabs } = state
  if (oldIndex !== -1) {
    const $Tab = $Tabs.children[oldIndex]
    $Tab.removeAttribute('aria-selected')
  }
  if (newIndex !== -1) {
    const $Tab = $Tabs.children[newIndex]
    $Tab.ariaSelected = true
    $Tabs.setAttribute('aria-activedescendant', $Tab.id)
  }
}
