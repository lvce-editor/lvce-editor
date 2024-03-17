import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as ViewletAboutEvents from './ViewletAboutEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet About'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.ContextMenu]: ViewletAboutEvents.handleContextMenu,
  })
}

export { ViewletAboutEvents as Events }

export const setFocused = (state, value) => {
  if (!value) {
    return
  }
  const { $Viewlet } = state
  const $Focusable = $Viewlet.querySelector('button')
  $Focusable.focus()
}
