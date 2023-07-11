import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ContextMenuFunctions from '../ContextMenuFunctions/ContextMenuFunctions.js'
import * as Event from '../Event/Event.js'

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ContextMenuFunctions.handleContextMenu(uid, button, clientX, clientY)
}
