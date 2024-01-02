import * as Assert from '../Assert/Assert.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDefineKeyBindingEvents from './ViewletDefineKeyBindingEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DefineKeyBinding'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom, ViewletDefineKeyBindingEvents)
}

export const setValue = (state, value) => {
  Assert.object(state)
  Assert.string(value)
  const { $Viewlet } = state
  const $Input = $Viewlet.querySelector('input')
  $Input.value = value
}

export const focus = (state) => {
  const { $Viewlet } = state
  const $Input = $Viewlet.querySelector('input')
  $Input.focus()
}
