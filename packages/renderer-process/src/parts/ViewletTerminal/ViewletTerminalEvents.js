import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleBlur(uid)
}

export const handleMouseDown = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleMouseDown(uid)
}

export const handleKeyDown = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleKeyDown(uid)
}
