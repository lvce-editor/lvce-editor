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
  const $PanelTabs = document.createElement('div')
  $PanelTabs.className = 'PanelTabs'
  // @ts-ignore
  $PanelTabs.role = AriaRoles.TabList
  $PanelTabs.onmousedown = ViewletPanelHeaderEvents.handleClickTab
  $PanelTabs.tabIndex = -1

  const $ButtonClose = IconButton.create$Button(UiStrings.Close, Icon.Close)
  $ButtonClose.onclick = ViewletPanelHeaderEvents.handleClickClose

  const $PanelToolBar = document.createElement('div')
  $PanelToolBar.className = 'PanelToolBar'
  // @ts-ignore
  $PanelToolBar.role = AriaRoles.ToolBar
  $PanelToolBar.append($ButtonClose)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet PanelHeader'
  $Viewlet.append($PanelTabs, $PanelToolBar)

  return {
    $PanelHeader: $Viewlet,
    $Viewlet,
    $PanelTabs,
  }
}

export const setTabs = (state, tabs) => {
  const { $PanelTabs } = state
  $PanelTabs.append(...tabs.map(create$PanelTab))
}

export const setSelectedIndex = (state, oldIndex, newIndex) => {
  const { $PanelTabs } = state
  if (oldIndex !== -1) {
    const $PanelTab = $PanelTabs.children[oldIndex]
    $PanelTab.removeAttribute('aria-selected')
  }
  if (newIndex !== -1) {
    const $PanelTab = $PanelTabs.children[newIndex]
    $PanelTab.ariaSelected = true
    $PanelTabs.setAttribute('aria-activedescendant', $PanelTab.id)
  }
}
