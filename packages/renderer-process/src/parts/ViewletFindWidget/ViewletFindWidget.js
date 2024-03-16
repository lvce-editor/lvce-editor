import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as RememberFocus from '../RememberFocus/RememberFocus.js'
import * as ViewletFindWidgetEvents from './ViewletFindWidgetEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet FindWidget'
  $Viewlet.role = AriaRoles.Group
  return {
    $Viewlet,
  }
}

export const focus = (state) => {
  const { $Viewlet } = state
  const $InputBox = $Viewlet.querySelector('.MultilineInputBox')
  if (!$InputBox) {
    return
  }
  $InputBox.focus()
}

export const setValue = (state, value) => {
  const { $Viewlet } = state
  const $InputBox = $Viewlet.querySelector('.MultilineInputBox')
  if (!$InputBox) {
    return
  }
  $InputBox.value = value
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  RememberFocus.rememberFocus($Viewlet, dom, ViewletFindWidgetEvents)
}
