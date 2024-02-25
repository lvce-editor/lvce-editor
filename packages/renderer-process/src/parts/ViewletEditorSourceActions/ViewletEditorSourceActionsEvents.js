import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

export const handleFocusIn = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleFocusIn(uid)
}
