import * as ComponentUid from '../ComponentUid/componentuid.ts'
import * as Event from '../Event/Event.js'
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
