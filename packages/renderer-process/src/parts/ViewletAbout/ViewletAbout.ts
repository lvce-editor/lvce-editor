import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as ViewletAboutEvents from './ViewletAboutEvents.ts'

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

export const setFocused = (state, value) => {
  if (!value) {
    return
  }
  const { $Viewlet } = state
  const $Focusable = $Viewlet.querySelector('button')
  $Focusable.focus()
}

export * as Events from './ViewletAboutEvents.ts'
