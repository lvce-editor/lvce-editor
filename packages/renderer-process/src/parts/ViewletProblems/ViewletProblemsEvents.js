import * as ViewletProblemsFunctions from './ViewletProblemsFunctions.js'

export const handlePointerDown = (event) => {
  event.preventDefault()
  ViewletProblemsFunctions.focusIndex(-1)
}
