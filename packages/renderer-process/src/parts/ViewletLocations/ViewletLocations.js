import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletLocationsEvents from './ViewletLocationsEvents.js'

export const create = () => {
  const $Locations = document.createElement('div')
  $Locations.className = 'LocationList'
  $Locations.role = AriaRoles.Tree
  $Locations.ariaLabel = 'Locations'
  $Locations.tabIndex = 0
  $Locations.setAttribute(DomAttributeType.AriaDescribedBy, 'LocationsMessage')
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Locations'
  $Viewlet.append($Locations)
  return {
    $Viewlet,
    $Locations,
  }
}

export const attachEvents = (state) => {
  const { $Locations } = state
  $Locations.onmousedown = ViewletLocationsEvents.handleLocationsMouseDown
}

export const setDom = (state, dom) => {
  const { $Locations } = state
  VirtualDom.renderInto($Locations, dom)
}

export const focus = (state) => {
  const { $Locations } = state
  $Locations.classList.add('FocusOutline')
  $Locations.focus()
  Focus.setFocus('locationList')
}
