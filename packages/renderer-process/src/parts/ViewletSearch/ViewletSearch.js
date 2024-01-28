import * as Assert from '../Assert/Assert.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
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
  const { $Viewlet } = state
  let input = ''
  let focused = document.activeElement.getAttribute('name')
  let $Input = $Viewlet.querySelector('[name="search-value"]')
  if ($Input) {
    input = $Input.value
  }
  let replaceInput = ''
  let $ReplaceInput = $Viewlet.querySelector('[name="search-replace-value"]')
  if ($ReplaceInput) {
    replaceInput = $ReplaceInput.value
  }
  VirtualDom.renderInto($Viewlet, dom, ViewletSearchEvents)
  $Input = $Viewlet.querySelector('[name="search-value"]')
  if ($Input) {
    $Input.value = input
  }
  $ReplaceInput = $Viewlet.querySelector('[name="search-replace-value"]')
  if ($ReplaceInput) {
    $ReplaceInput.value = replaceInput
  }
  if (focused) {
    const $Focused = $Viewlet.querySelector(`[name="${focused}"]`)
    if ($Focused) {
      $Focused.focus()
    }
  }
}

export const setValue = (state, value) => {
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = value
}

export const dispose = () => {}

export * from '../ViewletScrollable/ViewletScrollable.js'
