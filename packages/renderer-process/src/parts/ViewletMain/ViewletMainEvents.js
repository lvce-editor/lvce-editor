import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DataTransfer from '../DataTransfer/DataTransfer.js'
import * as Event from '../Event/Event.js'
import * as ViewletMainFunctions from './ViewletMainFunctions.js'

export const handleDragStart = (event) => {
  const { dataTransfer } = event
  DataTransfer.setEffectAllowed(dataTransfer, AllowedDragEffectType.CopyMove)
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
  const { dataTransfer, clientX, clientY } = event
  const { files } = dataTransfer
  const item = dataTransfer.items[0]
  const uid = ComponentUid.fromEvent(event)
  if (files.length > 0) {
    ViewletMainFunctions.handleDropFiles(uid, files)
    return
  }
  const filePath = DataTransfer.getFilePath(dataTransfer)
  if (filePath) {
    ViewletMainFunctions.handleDropFilePath(uid, clientX, clientY, filePath)
    return
  }
}
