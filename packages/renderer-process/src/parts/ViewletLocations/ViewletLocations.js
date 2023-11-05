import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletLocationsEvents from './ViewletLocationsEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Locations'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onmousedown = ViewletLocationsEvents.handleLocationsMouseDown
}

export const setLocationsDom = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $Viewlet } = state
  const $Root = VirtualDom.render(dom)
  $Viewlet.replaceChildren(...$Root.childNodes)
}

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
  Focus.setFocus(FocusKey.LocationList)
}
