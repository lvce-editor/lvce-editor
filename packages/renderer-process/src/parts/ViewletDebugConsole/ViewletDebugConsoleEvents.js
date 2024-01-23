import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

export const handleInput = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const { value } = target
  ForwardCommand.handleInput(uid, value)
}
