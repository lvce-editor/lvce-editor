import * as Layout from '../Layout/Layout.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Assert from '../Assert/Assert.js'

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
      console.warn(`unknown icon "${icon}"`)
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
  // @ts-ignore
  $StatusBarItem.role = 'button'
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
    // @ts-ignore
    $StatusBarItemIcon.style.maskImage = getMaskImageUrl(item.icon)
    $StatusBarItemIcon.style.webkitMaskImage = getMaskImageUrl(item.icon)
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
  $StatusBarItemsLeft.id = 'StatusBarItemsLeft'

  const $StatusBarItemsRight = document.createElement('ul')
  $StatusBarItemsRight.id = 'StatusBarItemsRight'

  const $StatusBar = Layout.state.$StatusBar
  $StatusBar.onclick = handleClick
  $StatusBar.tabIndex = 0
  $StatusBar.role = 'status'
  $StatusBar.ariaLive = 'off' // see https://github.com/microsoft/vscode/issues/94677
  $StatusBar.append($StatusBarItemsLeft, $StatusBarItemsRight)

  return {
    $StatusBar,
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
