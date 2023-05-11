import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as ViewletMainTabsFunctions from './ViewletMainTabsFunctions.js'

const ClassNames = {
  TabLabel: 'TabLabel',
  EditorTabCloseButton: 'EditorTabCloseButton',
  MainTab: 'MainTab',
}

// TODO
const getUid = () => {
  return ComponentUid.get(document.getElementById('Main'))
}

export const handleTabsWheel = (event) => {
  const uid = getUid()
  const { deltaX, deltaY } = event
  ViewletMainTabsFunctions.handleTabsWheel(uid, deltaX, deltaY)
}

export const handleDragStart = (event) => {
  event.dataTransfer.effectAllowed = AllowedDragEffectType.CopyMove
}

const getIndex = ($Target) => {
  const $Tab = $Target.closest(`.MainTab`)
  if (!$Tab) {
    return -1
  }
  return GetNodeIndex.getNodeIndex($Tab)
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
    default:
      handleTabMouseDown(event, index)
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

export const handlePointerOver = (event) => {
  const { target } = event
  const index = getIndex(target)
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabsPointerOver(uid, index)
}

export const handlePointerOut = (event) => {
  const { target, relatedTarget } = event
  const oldIndex = getIndex(target)
  const newIndex = getIndex(relatedTarget)
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabsPointerOut(uid, oldIndex, newIndex)
}
