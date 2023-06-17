import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as ViewletProblemsFunctions from './ViewletProblemsFunctions.js'

export const handlePointerDown = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletProblemsFunctions.focusIndex(uid, -1)
}
