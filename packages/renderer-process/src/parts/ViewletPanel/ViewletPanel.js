import * as Actions from '../Actions/Actions.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as ViewletPanelEvents from './ViewletPanelEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
  Maximize: 'Maximize',
}

const create$PanelTab = (label, index) => {
  const $PanelTab = document.createElement('div')
  $PanelTab.className = 'PanelTab'
  $PanelTab.role = AriaRoles.Tab
  $PanelTab.textContent = label
  $PanelTab.id = `PanelTab-${index + 1}`
  return $PanelTab
}

export const create = () => {
  const $PanelTabs = document.createElement('div')
  $PanelTabs.className = 'PanelTabs'
  $PanelTabs.role = AriaRoles.TabList
  $PanelTabs.tabIndex = -1

  const $ButtonClose = IconButton.create$Button(UiStrings.Close, Icon.Close)
  const $ButtonMaximize = IconButton.create$Button(UiStrings.Maximize, Icon.ChevronUp)
  // TODO use event delegation

  const $PanelToolBar = document.createElement('div')
  $PanelToolBar.className = 'PanelToolBar'
  $PanelToolBar.role = AriaRoles.ToolBar
  $PanelToolBar.append($ButtonMaximize, $ButtonClose)

  const $PanelHeader = document.createElement('div')
  $PanelHeader.className = 'PanelHeader'
  $PanelHeader.append($PanelTabs, $PanelToolBar)
  // const $PanelContent = document.createElement('div')
  // $PanelContent.id = 'PanelContent'
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Panel'
  $Viewlet.className = 'Viewlet Panel'
  $Viewlet.append($PanelHeader)
  $Viewlet.ariaLabel = 'Panel'
  return {
    $Panel: $Viewlet,
    $Viewlet,
    $PanelTabs,
    $PanelHeader,
    $PanelContent: undefined,
    $ButtonClose,
    $ButtonMaximize,
  }
  // await openViewlet('Terminal')
}

export const attachEvents = (state) => {
  const { $PanelTabs, $ButtonMaximize, $ButtonClose } = state
  $PanelTabs.onmousedown = ViewletPanelEvents.panelTabsHandleClick
  $ButtonMaximize.onclick = ViewletPanelEvents.handleClickMaximize
  $ButtonClose.onclick = ViewletPanelEvents.handleClickClose
}

export const setTabs = (state, tabs) => {
  const { $PanelTabs } = state
  $PanelTabs.append(...tabs.map(create$PanelTab))
}

// TODO add test for focus method
export const focus = (state) => {
  Assert.object(state)
  if (!state.currentViewlet) {
    return
  }
  state.currentViewlet.factory.focus(state.currentViewlet.state)
}

export const dispose = (state) => {
  if (state.$PanelContent) {
    state.$PanelContent.remove()
    state.$PanelContent = undefined
  }
  if (state.$PanelTabs) {
    state.$PanelTabs.remove()
    state.$PanelTabs = undefined
  }
  if (state.$PanelHeader) {
    state.$PanelHeader.remove()
    state.$PanelHeader = undefined
  }
}

export const setSelectedIndex = (state, oldIndex, newIndex) => {
  const { $PanelTabs } = state
  if (oldIndex !== -1) {
    const $PanelTab = $PanelTabs.children[oldIndex]
    $PanelTab.removeAttribute(DomAttributeType.AriaSelected)
  }
  if (newIndex !== -1) {
    const $PanelTab = $PanelTabs.children[newIndex]
    $PanelTab.ariaSelected = true
    $PanelTabs.setAttribute(DomAttributeType.AriaActiveDescendant, $PanelTab.id)
  }
}

export const setActions = (state, actions) => {
  const { $PanelTabs, $Actions } = state
  const $NewActions = Actions.create(actions)
  if ($Actions) {
    $Actions.replaceWith($NewActions)
  } else {
    $PanelTabs.after($NewActions)
  }
  state.$Actions = $NewActions
}
