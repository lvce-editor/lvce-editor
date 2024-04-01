import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

export const handleInput = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const { value } = target
  ForwardCommand.handleInput(uid, value)
}

export const handleFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleFocus(uid)
}
