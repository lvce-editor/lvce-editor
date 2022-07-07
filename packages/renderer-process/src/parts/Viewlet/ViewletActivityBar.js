import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as Layout from '../Layout/Layout.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

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
  const assetDir = Platform.getAssetDir()
  const $ActivityBarItemIcon = create$ActivityBarItemIcon(
    `${assetDir}/${item.icon}`
  )
  const $ActivityBarItem = document.createElement('div')
  $ActivityBarItem.className = 'ActivityBarItem'
  $ActivityBarItem.ariaLabel = '' // aria-label is determined by content  TODO is empty aria-label necessary or can it be left off?
  $ActivityBarItem.title = item.id
  $ActivityBarItem.tabIndex = -1
  $ActivityBarItem.dataset.viewletId = item.id
  if (item.keyShortcuts) {
    $ActivityBarItem.ariaKeyShortcuts = item.keyShortcuts
  }
  switch (item.flags) {
    case /* Tab */ 1:
      $ActivityBarItem.setAttribute('role', 'tab')
      $ActivityBarItem.ariaSelected = 'false'
      break
    case /* Button */ 2:
      $ActivityBarItem.setAttribute('role', 'button')
      $ActivityBarItem.ariaHasPopup = 'true'
      break
    default:
      console.warn(`unknown activity bar item flags ${item.flags}`)
      break
  }
  $ActivityBarItem.append($ActivityBarItemIcon)
  return $ActivityBarItem
}

const get$ItemFromEvent = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'ActivityBarItemIcon':
      return $Target.parentNode
    case 'ActivityBarItem':
      return $Target
    default:
      return undefined
  }
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleMousedown = (event) => {
  if (event.button !== 0) {
    return
  }
  const $Item = get$ItemFromEvent(event)
  if (!$Item) {
    return
  }
  event.preventDefault()
  event.stopPropagation()
  const index = getNodeIndex($Item)
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* ActivityBar.handleClick */ 'ActivityBar.handleClick',
    /* index */ index,
    /* x */ x,
    /* y */ y
  )
}

const handleContextMenu = (event) => {
  event.preventDefault()
  // TODO also move side bar position command
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* activityBarHandleContextMenu */ 'ActivityBar.handleContextMenu',
    /* x */ x,
    /* y */ y
  )
}

const handleBlur = () => {}

export const name = 'ActivityBar'

export const create = () => {
  const $ActivityBar = Layout.state.$ActivityBar
  $ActivityBar.setAttribute('role', 'toolbar') // TODO use idl once supported by chrome
  $ActivityBar.ariaLabel = 'Activity Bar'
  $ActivityBar.ariaOrientation = 'vertical'
  // $ActivityBar.append(...activityBarItems.map(create$ActivityBarItem))
  $ActivityBar.onmousedown = handleMousedown
  $ActivityBar.oncontextmenu = handleContextMenu
  $ActivityBar.onblur = handleBlur
  $ActivityBar.addEventListener('focusin', handleFocusIn)
  // $ActivityBar.children[focusedIndex].tabIndex = 0
  return {
    $ActivityBar,
  }
}

export const dispose = (state) => {}

export const setItems = (state, activityBarItems) => {
  Assert.object(state)
  Assert.array(activityBarItems)
  const $ActivityBar = state.$ActivityBar
  while ($ActivityBar.firstChild) {
    $ActivityBar.firstChild.remove()
  }
  $ActivityBar.append(...activityBarItems.map(create$ActivityBarItem))
}

const handleFocusIn = () => {
  Focus.setFocus('activityBar')
}

export const selectIndex = (state, oldIndex, newIndex) => {
  console.log({ select: true, oldIndex, newIndex })
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
