import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletFindWidgetEvents from './ViewletFindWidgetEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Find: 'Find',
}

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.ariaLabel = UiStrings.Find

  const $Details = document.createElement('div')
  $Details.className = 'FindWidgetDetails'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet FindWidget'
  $Viewlet.role = AriaRoles.Group
  $Viewlet.append($InputBox, $Details)
  return {
    $Viewlet,
    $InputBox,
    $Details,
  }
}

export const attachEvents = (state) => {
  const { $InputBox, $Viewlet } = state
  $InputBox.oninput = ViewletFindWidgetEvents.handleInput
  $InputBox.onblur = ViewletFindWidgetEvents.handleInputBlur
  $InputBox.onfocus = ViewletFindWidgetEvents.handleFocus

  $Viewlet.onclick = ViewletFindWidgetEvents.handleClick
}

export const focus = (state) => {
  const { $InputBox } = state
  $InputBox.focus()
}

export const setValue = (state, value) => {
  const { $InputBox } = state
  $InputBox.value = value
}

export const setMatchCountText = (state, value) => {
  const { $MatchCountText } = state
  $MatchCountText.nodeValue = value
}

export const setButtonsEnabled = (state, enabled) => {
  const { $ButtonFocusNext, $ButtonFocusPrevious } = state
  $ButtonFocusNext.disabled = !enabled
  $ButtonFocusPrevious.disabled = !enabled
}

export const setDom = (state, dom) => {
  const { $Details } = state
  VirtualDom.renderInto($Details, dom)
}
