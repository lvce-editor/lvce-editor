import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletAboutEvents from './ViewletAboutEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet About'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom, ViewletAboutEvents)
}

export const setFocused = (state, value) => {
  if (!value) {
    return
  }
  const { $Viewlet } = state
  const $Focusable = $Viewlet.querySelector('button')
  $Focusable.focus()
}
