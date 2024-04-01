import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleBlur(uid)
}

export const handleMouseDown = (event, ...args) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleMouseDown(uid, ...args)
}

export const handleKeyDown = (event, ...args) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleKeyDown(uid, ...args)
}
