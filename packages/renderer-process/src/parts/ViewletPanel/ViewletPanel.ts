import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as IconButton from '../IconButton/IconButton.ts'
import * as Viewlet from '../Viewlet/Viewlet.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as ViewletPanelEvents from './ViewletPanelEvents.ts'

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

  const $PanelActions = document.createElement('div')
  $PanelActions.className = 'Actions'
  $PanelActions.role = 'toolbar'

  const $PanelHeader = document.createElement('div')
  $PanelHeader.className = 'PanelHeader'
  $PanelHeader.append($PanelTabs, $PanelActions, $PanelToolBar)
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
    $PanelActions,
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

export const setActionsDom = (state, actions, childUid) => {
  const { $PanelTabs, $PanelActions } = state
  const instances = Viewlet.state.instances
  const instance = instances[childUid]
  if (!instance) {
    throw new Error(`child instance not found`)
  }
  const eventMap = instance.factory.EventMap
  RememberFocus.rememberFocus($PanelActions, actions, eventMap)
}
