import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

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
