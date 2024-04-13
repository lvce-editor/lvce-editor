import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletLocationsEvents from './ViewletLocationsEvents.ts'

export const Events = ViewletLocationsEvents

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $Viewlet } = state
  const $Locations = $Viewlet.children[1]
  if (oldFocusedIndex === -1) {
    $Locations.classList.remove('FocusOutline')
  } else {
    $Locations.children[oldFocusedIndex].classList.remove('Focused')
  }
  if (newFocusedIndex === -1) {
    $Locations.classList.add('FocusOutline')
  } else {
    $Locations.setAttribute(DomAttributeType.AriaActiveDescendant, `Reference-${newFocusedIndex}`)
    $Locations.children[newFocusedIndex].classList.add('Focused')
  }
}

export const handleError = (state, message) => {
  const { $Message } = state
  $Message.textContent = message
}

export const focus = (state) => {
  const { $Locations } = state
  $Locations.classList.add('FocusOutline')
  $Locations.focus()
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusLocationList)
}
