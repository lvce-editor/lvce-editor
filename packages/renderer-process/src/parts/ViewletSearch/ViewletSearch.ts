import * as Assert from '../Assert/Assert.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as ViewletSearchEvents from './ViewletSearchEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Search'

  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {}

export const refresh = (state, context) => {
  Assert.object(state)
}

export const focus = (state) => {
  Assert.object(state)
  state.$ViewletSearchInput.focus()
}

export const setDom = (state, dom) => {
  const { $ListItems } = state
  VirtualDom.renderInto($ListItems, dom)
}

export const setFullDom = (state, dom) => {
  // TODO replace this workaround with
  // virtual dom diffing
  RememberFocus.rememberFocus(state.$Viewlet, dom, ViewletSearchEvents)
}

export const setValue = (state, value) => {
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = value
}

export const setFocus = (state, selector) => {
  if (!selector) {
    return
  }
  const { $Viewlet } = state
  const $Element = $Viewlet.querySelector(selector)
  if ($Element) {
    $Element.focus()
  }
}

export const dispose = () => {}

export * from '../ViewletScrollable/ViewletScrollable.ts'
