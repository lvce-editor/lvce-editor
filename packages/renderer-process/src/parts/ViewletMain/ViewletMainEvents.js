import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.js'
import * as DataTransfer from '../DataTransfer/DataTransfer.js'
import * as Event from '../Event/Event.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletMainFunctions from './ViewletMainFunctions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'

const ClassNames = {
  Label: 'Label',
  EditorTabCloseButton: 'EditorTabCloseButton',
  MainTab: 'MainTab',
}

export const handleDragStart = (event) => {
  event.dataTransfer.effectAllowed = AllowedDragEffectType.CopyMove
}

export const handleDragOver = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  ViewletMainFunctions.handleDragOver(clientX, clientY)
}

export const handleDragEnd = (event) => {
  const { clientX, clientY } = event
  ViewletMainFunctions.handleDragEnd(clientX, clientY)
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDrop = (event) => {
  Event.preventDefault(event)
  const { dataTransfer, clientX, clientY } = event
  const { files } = dataTransfer
  if (files.length > 0) {
    ViewletMainFunctions.handleDropFiles(clientX, clientY, files)
    return
  }
  const filePath = DataTransfer.getFilePath(dataTransfer)
  if (filePath) {
    ViewletMainFunctions.handleDropFilePath(clientX, clientY, filePath)
    return
  }
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
  ViewletMainFunctions.closeEditor(index)
}

export const handleTabMouseDown = (event, index) => {
  const { button } = event
  switch (button) {
    case MouseEventType.LeftClick:
      ViewletMainFunctions.handleTabClick(index)
      break
    case MouseEventType.MiddleClick:
      ViewletMainFunctions.closeEditor(index)
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
  Event.preventDefault(event)
  ViewletMainFunctions.handleTabContextMenu(index, clientX, clientY)
}

const handleSashPointerMove = () => {
  //
}

const handleSashPointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handleSashPointerCaptureLost)
}

export const handleSashPointerDown = (event) => {
  const { clientX, clientY, target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.addEventListener(DomEventType.LostPointerCapture, handleSashPointerCaptureLost)
  ViewletMainFunctions.handleSashPointerDown(clientX, clientY)
}
