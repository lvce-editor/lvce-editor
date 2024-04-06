import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DataTransfer from '../DataTransfer/DataTransfer.ts'
import * as Event from '../Event/Event.ts'
import * as ViewletMainTabsFunctions from './ViewletMainTabsFunctions.ts'

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
  // @ts-expect-error
  DataTransfer.setEffectAllowed(AllowedDragEffectType.CopyMove)
}

export const handleTabsMouseDown = (event) => {
  const { clientX, clientY, button } = event
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabClick(uid, button, clientX, clientY)
}

export const handleTabsContextMenu = (event) => {
  const { clientX, clientY } = event
  Event.preventDefault(event)
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabContextMenu(uid, clientX, clientY)
}
