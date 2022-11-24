import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Focus from '../Focus/Focus.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleLocationsMouseDown = (event) => {
  if (event.button !== MouseEventType.LeftClick) {
    return
  }
  const $Target = event.target
  if ($Target.classList.contains('TreeItem')) {
    const index = getNodeIndex($Target)
    RendererWorker.send(
      /* ViewletLocations.selectIndex */ 'Locations.selectIndex',
      /* index */ index
    )
  } else if ($Target.classList.contains('LocationList')) {
    RendererWorker.send(
      /* ViewletLocations.focusIndex */ 'Locations.focusIndex',
      /* index */ -1
    )
  }
}

export const create = () => {
  const $Message = document.createElement('div')
  $Message.className = 'LocationsMessage'
  $Message.id = 'LocationsMessage'
  // @ts-ignore
  $Message.role = AriaRoles.Status
  const $Locations = document.createElement('div')
  $Locations.className = 'LocationList'
  // @ts-ignore
  $Locations.role = AriaRoles.Tree
  $Locations.ariaLabel = 'Locations'
  $Locations.tabIndex = 0
  $Locations.onmousedown = handleLocationsMouseDown
  $Locations.setAttribute('aria-described-by', 'LocationsMessage')
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Locations'
  $Viewlet.append($Message, $Locations)
  return {
    $Viewlet,
    $Message,
    $Locations,
  }
}

const create$Location = () => {
  // TODO reuse logic from tree view
  const $Location = document.createElement('div')
  $Location.className = 'TreeItem'
  // @ts-ignore
  $Location.role = AriaRoles.TreeItem
  return $Location
}

const render$Location = ($Location, location) => {
  switch (location.type) {
    case 'leaf':
      $Location.className = 'TreeItem'
      $Location.textContent = location.lineText || '(empty line)'
      $Location.ariaExpanded = undefined
      $Location.id = `Reference-${location.index}`
      break
    case 'collapsed':
      $Location.className = `TreeItem Icon${location.icon}`
      $Location.textContent = location.name
      $Location.ariaExpanded = false
      $Location.id = `Reference-${location.index}`
    case 'expanded':
      $Location.className = `TreeItem Icon${location.icon}`
      $Location.ariaExpanded = true
      $Location.textContent = location.name
      $Location.id = `Reference-${location.index}`
    default:
      break
  }

  // TODO
}

const render$Locations = ($Locations, locations) => {
  $Locations.textContent = ''
  const fragment = document.createDocumentFragment()
  for (const location of locations) {
    const $Location = create$Location()
    render$Location($Location, location)
    fragment.append($Location)
  }
  $Locations.append(fragment)
}

export const setLocations = (state, locations) => {
  const { $Locations } = state
  render$Locations($Locations, locations)
}

export const setMessage = (state, message) => {
  const { $Message } = state
  $Message.textContent = message
}

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $Locations } = state
  if (oldFocusedIndex === -1) {
    $Locations.classList.remove('FocusOutline')
  } else {
    $Locations.children[oldFocusedIndex].classList.remove('Focused')
  }
  if (newFocusedIndex === -1) {
    $Locations.classList.add('FocusOutline')
  } else {
    $Locations.setAttribute(
      'aria-activedescendant',
      `Reference-${newFocusedIndex}`
    )
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
  Focus.setFocus('locationList')
}
