import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleContextMenu(uid, button, clientX, clientY)
}
