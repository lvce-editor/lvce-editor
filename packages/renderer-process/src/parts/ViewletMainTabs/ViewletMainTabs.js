import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
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
  AttachEvents.attachEvents($MainTabs, {
    [DomEventType.MouseDown]: ViewletMainTabEvents.handleTabsMouseDown,
    [DomEventType.ContextMenu]: ViewletMainTabEvents.handleTabsContextMenu,
    [DomEventType.DragStart]: ViewletMainTabEvents.handleDragStart,
  })
  $MainTabs.addEventListener(DomEventType.Wheel, ViewletMainTabEvents.handleTabsWheel, DomEventOptions.Passive)
}

export const setTabsDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setScrollLeft = (state, scrollLeft) => {
  const { $Viewlet } = state
  $Viewlet.scrollLeft = scrollLeft
}
