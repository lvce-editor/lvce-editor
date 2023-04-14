import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as Logger from '../Logger/Logger.js'
import * as MaskImage from '../MaskImage/MaskImage.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const getIconClassName = (icon) => {
  switch (icon) {
    case '$(sync-spin)':
    case '$(sync~spin)':
      return 'StatusBarIcon AnimationSpin'
    case '$(sync)':
      return 'StatusBarIcon'
    case '$(source-control)':
      return 'StatusBarIcon'
    default:
      Logger.warn(`unknown icon "${icon}"`)
      return ''
  }
}

const getMaskImageUrl = (icon) => {
  switch (icon) {
    case '$(sync-spin)':
    case '$(sync~spin)':
    case '$(sync)':
      return 'url(/icons/icon-sync.svg)'
    case '$(source-control)':
      return 'url(/icons/icon-source-control.svg)'
    default:
      return ''
  }
}

const create$StatusBarItem = (item) => {
  const $StatusBarItem = document.createElement('li')
  $StatusBarItem.className = 'StatusBarItem'
  $StatusBarItem.role = AriaRoles.Button
  $StatusBarItem.dataset.name = item.name
  $StatusBarItem.tabIndex = -1
  $StatusBarItem.textContent = item.text
  $StatusBarItem.dataset.command = item.command
  if (item.tooltip) {
    $StatusBarItem.title = item.tooltip
  }
  if (item.icon) {
    const $StatusBarItemIcon = document.createElement('span')
    $StatusBarItemIcon.className = getIconClassName(item.icon)
    MaskImage.setMaskImage($StatusBarItemIcon, item.icon)
    $StatusBarItem.prepend($StatusBarItemIcon)
  }
  return $StatusBarItem
}

const handleClick = (event) => {
  const $Target = event.target
  if ($Target.className !== 'StatusBarItem') {
    return
  }
  const command = Number.parseInt($Target.dataset.command, 10)
  RendererWorker.send(command)
}

// TODO get items from renderer worker
// const statusBarItemsLeft = [
//   {
//     name: 'RunTests',
//     text: 'Run Tests',
//     tooltip: '',
//     command: 909021,
//   },
// ]

// const statusBarItemsRight = []

export const create = (statusBarItemsLeft, statusBarItemsRight) => {
  const $StatusBarItemsLeft = document.createElement('ul')
  $StatusBarItemsLeft.className = 'StatusBarItemsLeft'

  const $StatusBarItemsRight = document.createElement('ul')
  $StatusBarItemsRight.className = 'StatusBarItemsRight'

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'StatusBar'
  $Viewlet.className = 'Viewlet StatusBar'
  $Viewlet.onclick = handleClick
  $Viewlet.tabIndex = 0
  $Viewlet.role = AriaRoles.Status
  $Viewlet.ariaRoleDescription = AriaRoleDescriptionType.StatusBar
  $Viewlet.ariaLive = 'off' // see https://github.com/microsoft/vscode/issues/94677
  $Viewlet.append($StatusBarItemsLeft, $StatusBarItemsRight)

  return {
    $Viewlet,
    $StatusBar: $Viewlet,
    $StatusBarItemsLeft,
    $StatusBarItemsRight,
  }
}

const clearNode = (node) => {
  while (node.firstChild) {
    node.firstChild.remove()
  }
}

export const setItems = (state, statusBarItemsLeft, statusBarItemsRight) => {
  const $StatusBarItemsLeft = state.$StatusBarItemsLeft
  const $StatusBarItemsRight = state.$StatusBarItemsRight
  clearNode($StatusBarItemsLeft)
  clearNode($StatusBarItemsRight)
  $StatusBarItemsLeft.append(...statusBarItemsLeft.map(create$StatusBarItem))
  $StatusBarItemsRight.append(...statusBarItemsRight.map(create$StatusBarItem))
}

export const focus = (state) => {
  Assert.object(state)
  state.$StatusBar.focus()
}
