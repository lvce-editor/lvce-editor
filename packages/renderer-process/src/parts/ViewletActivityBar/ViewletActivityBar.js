import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActvityBarItemFlags.js'
import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletActivityBarEvents from './ViewletActivityBarEvents.js'

// TODO set aria-selected false when sidebar is collapsed

const create$ActivityBarItemIcon = (icon) => {
  const $ActivityBarItemIcon = document.createElement('div')
  $ActivityBarItemIcon.className = 'ActivityBarItemIcon'
  // @ts-ignore
  $ActivityBarItemIcon.style.maskImage = `url(${icon})`
  $ActivityBarItemIcon.style.webkitMaskImage = `url(${icon})`
  return $ActivityBarItemIcon
}

// TODO assetDir might not work with non-builtin extension icons
const create$ActivityBarItem = (item) => {
  const $ActivityBarItemIcon = create$ActivityBarItemIcon(`${item.icon}`)
  const $ActivityBarItem = document.createElement('div')
  $ActivityBarItem.className = 'ActivityBarItem'
  $ActivityBarItem.ariaLabel = '' // aria-label is determined by content  TODO is empty aria-label necessary or can it be left off?
  $ActivityBarItem.title = item.title
  $ActivityBarItem.tabIndex = -1
  $ActivityBarItem.dataset.viewletId = item.id
  if (item.keyShortcuts) {
    $ActivityBarItem.ariaKeyShortcuts = item.keyShortcuts
  }
  switch (item.flags) {
    case ActivityBarItemFlags.Tab:
      // @ts-ignore
      $ActivityBarItem.role = 'tab'
      $ActivityBarItem.ariaSelected = 'false'
      break
    case ActivityBarItemFlags.Button:
      // @ts-ignore
      $ActivityBarItem.role = 'button'
      $ActivityBarItem.ariaHasPopup = 'true'
      break
    default:
      console.warn(`unknown activity bar item flags ${item.flags}`)
      break
  }
  $ActivityBarItem.append($ActivityBarItemIcon)
  return $ActivityBarItem
}

export const name = 'ActivityBar'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'ActivityBar'
  $Viewlet.dataset.viewletId = 'ActivityBar'
  // @ts-ignore
  $Viewlet.role = 'toolbar'
  $Viewlet.ariaRoleDescription = 'Activity Bar'
  $Viewlet.ariaOrientation = 'vertical'
  // $Viewlet.append(...activityBarItems.map(create$ActivityBarItem))
  $Viewlet.onmousedown = ViewletActivityBarEvents.handleMousedown
  $Viewlet.oncontextmenu = ViewletActivityBarEvents.handleContextMenu
  $Viewlet.onblur = ViewletActivityBarEvents.handleBlur
  $Viewlet.addEventListener('focusin', ViewletActivityBarEvents.handleFocusIn)
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

export const selectIndex = (state, oldIndex, newIndex) => {
  if (oldIndex !== -1) {
    const $OldItem = state.$ActivityBar.children[oldIndex]
    $OldItem.ariaSelected = 'false'
    if (newIndex !== -1) {
      $OldItem.tabIndex = -1
    }
  }
  if (newIndex !== -1) {
    const $NewItem = state.$ActivityBar.children[newIndex]
    $NewItem.ariaSelected = 'true'
    $NewItem.tabIndex = 0
  }
}

const focus$Item = ($Item) => {
  Focus.focus($Item, 'activityBar')
}

export const setFocusedIndex = (state, oldIndex, newIndex) => {
  const { $ActivityBar } = state
  if (oldIndex !== -1) {
    const $OldItem = $ActivityBar.children[oldIndex]
    $OldItem.tabIndex = -1
    $OldItem.classList.remove('FocusOutline')
  }
  if (newIndex !== -1) {
    const $NewItem = $ActivityBar.children[newIndex]
    $NewItem.tabIndex = 0
    $NewItem.classList.add('FocusOutline')
    focus$Item($NewItem)
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
