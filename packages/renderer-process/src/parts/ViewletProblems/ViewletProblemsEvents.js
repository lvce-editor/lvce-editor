import * as Event from '../Event/Event.js'
import * as ViewletProblemsFunctions from './ViewletProblemsFunctions.js'

export const handlePointerDown = (event) => {
  Event.preventDefault(event)
  ViewletProblemsFunctions.focusIndex(-1)
}
