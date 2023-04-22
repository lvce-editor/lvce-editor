import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as ViewletMainTabsFunctions from './ViewletMainTabsFunctions.js'

const ClassNames = {
  Label: 'Label',
  EditorTabCloseButton: 'EditorTabCloseButton',
  MainTab: 'MainTab',
}

export const handleDragStart = (event) => {
  event.dataTransfer.effectAllowed = AllowedDragEffectType.CopyMove
}

// TODO
const getUid = () => {
  return ComponentUid.get(document.getElementById('Main'))
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  const $Tab = $Target.closest(`.MainTab`)
  if (!$Tab) {
    return undefined
  }
  return getNodeIndex($Tab)
}

export const handleTabCloseButtonMouseDown = (event, index) => {
  const uid = getUid()
  ViewletMainTabsFunctions.closeEditor(uid, index)
}

export const handleTabMouseDown = (event, index) => {
  const { button } = event
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabClick(uid, button, index)
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
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabContextMenu(uid, index, clientX, clientY)
}
