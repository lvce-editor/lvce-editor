import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as ViewletTitleBarEvents from './ViewletTitleBarEvents.js'

export const create = () => {
  // TODO set aria label for title bar menu
  // TODO add tests for aria properties
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'TitleBar'
  $Viewlet.className = 'Viewlet TitleBar'
  $Viewlet.ariaLabel = 'Title Bar'
  $Viewlet.role = AriaRoles.ContentInfo
  return {
    $TitleBar: $Viewlet,
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.ContextMenu]: ViewletTitleBarEvents.handleContextMenu,
  })
}

const activeClassName = 'TitleBarActive'

export const setFocused = (state, isFocused) => {
  const { $Viewlet } = state
  if (isFocused) {
    $Viewlet.classList.add(activeClassName)
  } else {
    $Viewlet.classList.remove(activeClassName)
  }
}
