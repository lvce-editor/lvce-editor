import * as AriaOrientationType from '../AriaOrientationType/AriaOrientationType.ts'
import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletActivityBarEvents from './ViewletActivityBarEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'ActivityBar'
  $Viewlet.className = 'Viewlet ActivityBar'
  $Viewlet.role = AriaRoles.ToolBar
  $Viewlet.ariaRoleDescription = AriaRoleDescriptionType.ActivityBar
  $Viewlet.ariaOrientation = AriaOrientationType.Vertical
  $Viewlet.tabIndex = 0
  return {
    $ActivityBar: $Viewlet,
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.MouseDown]: ViewletActivityBarEvents.handleMousedown,
    [DomEventType.ContextMenu]: ViewletActivityBarEvents.handleContextMenu,
    [DomEventType.Focus]: ViewletActivityBarEvents.handleFocus,
    [DomEventType.Blur]: ViewletActivityBarEvents.handleBlur,
  })
}

export const dispose = (state) => {}

export const setBadgeCount = (state, index, count) => {
  const { $ActivityBar } = state
  const $Item = $ActivityBar.children[index]
  const $Badge = document.createElement('div')
  $Badge.className = 'ActivityBarItemBadge'
  $Badge.textContent = `${count}`
  // @ts-ignore
  $Item.append($Badge)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
