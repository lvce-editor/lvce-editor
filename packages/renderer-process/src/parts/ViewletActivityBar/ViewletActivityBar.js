import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as Logger from '../Logger/Logger.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletActivityBarEvents from './ViewletActivityBarEvents.js'

const activeId = 'ActivityBarItemActive'

// TODO set aria-selected false when sidebar is collapsed

const create$ActivityBarItemIcon = (icon) => {
  return MaskIcon.create(icon)
}

// TODO assetDir might not work with non-builtin extension icons
const create$ActivityBarItem = (item) => {
  const $ActivityBarItemIcon = create$ActivityBarItemIcon(`${item.icon}`)
  const $ActivityBarItem = document.createElement('div')
  $ActivityBarItem.className = 'ActivityBarItem'
  $ActivityBarItem.ariaLabel = '' // aria-label is determined by content  TODO is empty aria-label necessary or can it be left off?
  $ActivityBarItem.title = item.title
  if (item.keyShortcuts) {
    $ActivityBarItem.ariaKeyShortcuts = item.keyShortcuts
  }
  switch (item.flags) {
    case ActivityBarItemFlags.Tab:
      // @ts-ignore
      $ActivityBarItem.role = AriaRoles.Tab
      $ActivityBarItem.ariaSelected = 'false'
      break
    case ActivityBarItemFlags.Button:
      // @ts-ignore
      $ActivityBarItem.role = AriaRoles.Button
      $ActivityBarItem.ariaHasPopup = 'true'
      break
    default:
      Logger.warn(`unknown activity bar item flags ${item.flags}`)
      break
  }
  $ActivityBarItem.append($ActivityBarItemIcon)
  return $ActivityBarItem
}

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'ActivityBar'
  $Viewlet.className = 'Viewlet ActivityBar'
  // @ts-ignore
  $Viewlet.role = AriaRoles.ToolBar
  $Viewlet.ariaRoleDescription = 'Activity Bar'
  $Viewlet.ariaOrientation = 'vertical'
  $Viewlet.tabIndex = 0
  // $Viewlet.append(...activityBarItems.map(create$ActivityBarItem))
  $Viewlet.onmousedown = ViewletActivityBarEvents.handleMousedown
  $Viewlet.oncontextmenu = ViewletActivityBarEvents.handleContextMenu
  // $Viewlet.addEventListener('focusout', ViewletActivityBarEvents.handleBlur)
  $Viewlet.onfocus = ViewletActivityBarEvents.handleFocus
  $Viewlet.onblur = ViewletActivityBarEvents.handleBlur
  // $ActivityBar.children[focusedIndex].tabIndex = 0
  return {
    $ActivityBar: $Viewlet,
    $Viewlet,
  }
}

export const dispose = (state) => {}

export const setItems = (state, activityBarItems) => {
  Assert.object(state)
  Assert.array(activityBarItems)
  const $ActivityBar = state.$ActivityBar
  $ActivityBar.replaceChildren(...activityBarItems.map(create$ActivityBarItem))
}

export const setSelectedIndex = (state, oldIndex, newIndex) => {
  const { $ActivityBar } = state
  if (oldIndex !== -1) {
    const $OldItem = $ActivityBar.children[oldIndex]
    $OldItem.ariaSelected = 'false'
  }
  if (newIndex !== -1) {
    const $NewItem = $ActivityBar.children[newIndex]
    $NewItem.ariaSelected = 'true'
  }
}

export const setFocusedIndex = (state, oldIndex, newIndex, focused) => {
  const { $ActivityBar } = state
  if (oldIndex !== -1) {
    const $OldItem = $ActivityBar.children[oldIndex]
    $OldItem.removeAttribute('id')
    $OldItem.classList.remove('FocusOutline')
  }
  if (newIndex !== -1) {
    const $NewItem = $ActivityBar.children[newIndex]
    $NewItem.id = activeId
    $ActivityBar.setAttribute(DomAttributeType.AriaActiveDescendant, activeId)
    if (focused) {
      $NewItem.classList.add('FocusOutline')
    }
  }
}

export const setBadgeCount = (state, index, count) => {
  const { $ActivityBar } = state
  const $Item = $ActivityBar.children[index]
  const $Badge = document.createElement('div')
  $Badge.className = 'ActivityBarItemBadge'
  $Badge.textContent = `${count}`
  // @ts-ignore
  $Item.append($Badge)
}
