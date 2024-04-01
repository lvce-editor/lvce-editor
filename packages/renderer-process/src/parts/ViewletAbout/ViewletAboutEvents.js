import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'
import * as Event from '../Event/Event.js'

export const handleClickOk = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleClickOk(uid)
}

export const handleClickClose = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleClickClose(uid)
}

export const handleClickCopy = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleClickCopy(uid)
}

export const handleFocusIn = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleFocusIn(uid)
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
}
