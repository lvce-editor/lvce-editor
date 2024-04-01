import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ViewletProblemsFunctions from './ViewletProblemsFunctions.js'

export const handlePointerDown = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  const { clientX, clientY } = event
  ViewletProblemsFunctions.handleClickAt(uid, clientX, clientY)
}

export const handleContextMenu = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { clientX, clientY } = event
  ViewletProblemsFunctions.handleContextMenu(uid, clientX, clientY)
}
