import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletProblemsEvents from './ViewletProblemsEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Problems'
  $Viewlet.tabIndex = 0
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.PointerDown]: ViewletProblemsEvents.handlePointerDown,
    [DomEventType.ContextMenu]: ViewletProblemsEvents.handleContextMenu,
  })
}

export const setFocusedIndex = (state, focusedIndex) => {
  const { $Viewlet } = state
  if (focusedIndex === -1) {
    $Viewlet.classList.add('FocusOutline')
    $Viewlet.focus()
  }
}

export const setProblemsDom = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setMessage = (state, message) => {
  const { $Viewlet } = state
  $Viewlet.textContent = message
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.focus()
}
