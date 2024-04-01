import * as ComponentUid from '../ComponentUid/componentuid.ts'
import * as Event from '../Event/Event.js'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleContextMenu(uid, button, clientX, clientY)
}
