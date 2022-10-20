import * as Layout from '../Layout/Layout.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleDragOver = (event) => {
  event.preventDefault()
  Layout.state.$Main.classList.add('DropTarget')
}

export const handleDrop = async (event) => {
  console.log('[main] drop')
  event.preventDefault()
  Layout.state.$Main.classList.remove('DropTarget')
  RendererWorker.send(/* handleDrop */ 'Main.handleDrop')
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'EditorTabCloseButton':
      return getNodeIndex($Target.parentNode)
    case 'MainTab':
      return getNodeIndex($Target)
    default:
      return -1
  }
}

export const handleTabCloseButtonMouseDown = (event, index) => {
  RendererWorker.send(
    /* Main.closeEditor */ 'Main.closeEditor',
    /* index */ index
  )
}

export const handleTabMouseDown = (event, index) => {
  switch (event.button) {
    case MouseEventType.LeftClick:
      RendererWorker.send(
        /* Main.handleTabClick */ 'Main.handleTabClick',
        /* index */ index
      )
      break
    case MouseEventType.MiddleClick:
      RendererWorker.send(
        /* Main.closeEditor */ 'Main.closeEditor',
        /* index */ index
      )
      break
    case MouseEventType.RightClick:
      break
    default:
      break
  }
}

export const handleTabsMouseDown = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  event.preventDefault()
  switch ($Target.className) {
    case 'EditorTabCloseButton':
      handleTabCloseButtonMouseDown(event, index)
      break
    case 'MainTab':
      handleTabMouseDown(event, index)
      break
    default:
      break
  }
}

export const handleTabsContextMenu = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  event.preventDefault()
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Main.handleTabContextMenu */ 'Main.handleTabContextMenu',
    /* index */ index,
    /* x */ x,
    /* y */ y
  )
}
