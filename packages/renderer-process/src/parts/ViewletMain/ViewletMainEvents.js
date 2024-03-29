export * from '../DragEvents/DragEvents.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.js'

export const handleContextMenu = (event) => {
  if (event.defaultPrevented) {
    return
  }
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleContextMenu(uid, clientX, clientY)
}
