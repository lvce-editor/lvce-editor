import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DataTransfer from '../DataTransfer/DataTransfer.js'
import * as Event from '../Event/Event.js'
import * as ViewletMainFunctions from './ViewletMainFunctions.js'

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
  const uid = ComponentUid.fromEvent(event)
  ViewletMainFunctions.handleDragOver(uid, clientX, clientY)
}

export const handleDragEnd = (event) => {
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletMainFunctions.handleDragEnd(uid, clientX, clientY)
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDrop = (event) => {
  Event.preventDefault(event)
  const { dataTransfer } = event
  const { files } = dataTransfer
  const item = dataTransfer.items[0]
  const uid = ComponentUid.fromEvent(event)
  if (files.length > 0) {
    ViewletMainFunctions.handleDropFiles(uid, files)
    return
  }
  const filePath = DataTransfer.getFilePath(dataTransfer)
  if (filePath) {
    ViewletMainFunctions.handleDropFilePath(uid, filePath)
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
  const uid = ComponentUid.fromEvent(event)
  ViewletMainFunctions.closeEditor(uid, index)
}

export const handleTabMouseDown = (event, index) => {
  const { button } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletMainFunctions.handleTabClick(uid, button, index)
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
  const uid = ComponentUid.fromEvent(event)
  if (index === -1) {
    return
  }
  Event.preventDefault(event)
  ViewletMainFunctions.handleTabContextMenu(uid, index, clientX, clientY)
}
