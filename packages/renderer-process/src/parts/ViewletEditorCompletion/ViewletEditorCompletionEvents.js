import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as ViewletEditorCompletionFunctions from './ViewletEditorCompletionFunctions.js'

export const handleMousedown = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorCompletionFunctions.handleClickAt(uid, clientX, clientY)
}

export * from '../VirtualListEvents/VirtualListEvents.js'
