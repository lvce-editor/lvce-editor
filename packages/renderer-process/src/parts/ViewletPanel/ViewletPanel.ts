import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as IconButton from '../IconButton/IconButton.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletPanelEvents from './ViewletPanelEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
  Maximize: 'Maximize',
}

export const create = () => {
  const $PanelTabs = document.createElement('div')
  $PanelTabs.className = 'PanelTabs'
  $PanelTabs.role = AriaRoles.TabList
  $PanelTabs.tabIndex = -1

  const $ButtonClose = IconButton.create$Button(UiStrings.Close, 'Close')
  const $ButtonMaximize = IconButton.create$Button(UiStrings.Maximize, 'ChevronUp')
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
  const { $ButtonMaximize, $ButtonClose, $PanelHeader } = state
  AttachEvents.attachEvents($PanelHeader, {
    [DomEventType.Click]: ViewletPanelEvents.handleHeaderClick,
  })
  AttachEvents.attachEvents($ButtonMaximize, {
    [DomEventType.Click]: ViewletPanelEvents.handleClickMaximize,
  })
  AttachEvents.attachEvents($ButtonClose, {
    [DomEventType.Click]: ViewletPanelEvents.handleClickClose,
  })
}

export const setTabsDom = (state, dom) => {
  const { $PanelTabs } = state
  VirtualDom.renderInto($PanelTabs, dom)
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

export const setActionsDom = (state, actions) => {
  const { $PanelTabs, $Actions } = state
  const $NewActions = VirtualDom.render(actions).firstChild
  if ($Actions) {
    $Actions.replaceWith($NewActions)
  } else {
    $NewActions.addEventListener(DomEventType.Input, ViewletPanelEvents.handleFilterInput, {
      capture: true,
    })
    $PanelTabs.after($NewActions)
  }
  state.$Actions = $NewActions
}
