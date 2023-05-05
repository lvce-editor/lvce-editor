import * as AriaOrientationType from '../AriaOrientationType/AriaOrientationType.js'
import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletActivityBarEvents from './ViewletActivityBarEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'ActivityBar'
  $Viewlet.className = 'Viewlet ActivityBar'
  // @ts-ignore
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
  $Viewlet.onmousedown = ViewletActivityBarEvents.handleMousedown
  $Viewlet.oncontextmenu = ViewletActivityBarEvents.handleContextMenu
  $Viewlet.onfocus = ViewletActivityBarEvents.handleFocus
  $Viewlet.onblur = ViewletActivityBarEvents.handleBlur
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

export const setDiff = (state, diff) => {
  const { $Viewlet } = state
  VirtualDom.renderDiff($Viewlet, diff)
}
