import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const ClassNames = {
  Label: 'Label',
  EditorTabCloseButton: 'EditorTabCloseButton',
  MainTab: 'MainTab',
}

export const handleDragOver = (event) => {
  event.preventDefault()
}

export const handleDrop = async (event) => {
  event.preventDefault()
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
    case ClassNames.EditorTabCloseButton:
    case ClassNames.Label:
      return getNodeIndex($Target.parentNode)
    case ClassNames.MainTab:
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
  const { button } = event
  switch (button) {
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
  const { target } = event
  const index = getIndex(target)
  if (index === -1) {
    return
  }
  event.preventDefault()
  switch (target.className) {
    case ClassNames.EditorTabCloseButton:
      handleTabCloseButtonMouseDown(event, index)
      break
    case ClassNames.MainTab:
    case ClassNames.Label:
      handleTabMouseDown(event, index)
      break
    default:
      break
  }
}

export const handleTabsContextMenu = (event) => {
  const { clientX, clientY, target } = event
  const index = getIndex(target)
  if (index === -1) {
    return
  }
  event.preventDefault()
  RendererWorker.send(
    /* Main.handleTabContextMenu */ 'Main.handleTabContextMenu',
    /* index */ index,
    /* x */ clientX,
    /* y */ clientY
  )
}
