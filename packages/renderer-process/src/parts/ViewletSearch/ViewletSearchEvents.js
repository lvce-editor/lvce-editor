import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* ViewletSearch.handleInput */ 'Search.handleInput',
    /* value */ value
  )
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndexTreeItem = ($Target) => {
  return getNodeIndex($Target)
}

const getIndexTreeItemLabel = ($Target) => {
  return getNodeIndex($Target.parentNode)
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'TreeItem':
      return getIndexTreeItem($Target)
    case 'TreeItemLabel':
      return getIndexTreeItemLabel($Target)
    default:
      return -1
  }
}

export const handleClick = (event) => {
  if (event.button === MouseEventType.RightClick) {
    return
  }
  const $Target = event.target
  const index = getIndex($Target)
  RendererWorker.send(
    /* Search.handleClick */ 'Search.handleClick',
    /* index */ index
  )
}

const handleContextMenuMouse = (event) => {
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Search.handleContextMenuMouseAt */ 'Search.handleContextMenuMouseAt',
    /* x */ x,
    /* y */ y
  )
}

const handleContextMenuKeyboard = (event) => {
  RendererWorker.send(
    /* Search.handleContextMenuKeyboard */ 'Search.handleContextMenuKeyboard'
  )
}

export const handleContextMenu = (event) => {
  event.preventDefault()
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}
