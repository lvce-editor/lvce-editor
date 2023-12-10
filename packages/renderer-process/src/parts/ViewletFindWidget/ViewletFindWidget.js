import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletFindWidgetEvents from './ViewletFindWidgetEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
  PreviousMatch: 'Previous Match',
  NextMatch: 'Next Match',
  Find: 'Find',
}

export const create = () => {
  // TODO recycle nodes
  const $InputBox = InputBox.create()
  $InputBox.ariaLabel = UiStrings.Find

  const $MatchCountText = document.createTextNode('')
  const $MatchCount = document.createElement('div')
  $MatchCount.className = 'FindWidgetMatchCount'
  $MatchCount.append($MatchCountText)

  const $ButtonFocusNext = IconButton.create$Button(UiStrings.NextMatch, 'ArrowDown')
  const $ButtonFocusPrevious = IconButton.create$Button(UiStrings.PreviousMatch, 'ArrowUp')
  const $ButtonClose = IconButton.create$Button(UiStrings.Close, 'Close')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet FindWidget'
  $Viewlet.role = AriaRoles.Group
  $Viewlet.append($InputBox, $MatchCount, $ButtonFocusPrevious, $ButtonFocusNext, $ButtonClose)
  return {
    $Viewlet,
    $InputBox,
    $MatchCount,
    $MatchCountText,
    $ButtonClose,
    $ButtonFocusNext,
    $ButtonFocusPrevious,
  }
}

export const attachEvents = (state) => {
  const { $InputBox, $Viewlet } = state
  AttachEvents.attachEvents($InputBox, {
    [DomEventType.Input]: ViewletFindWidgetEvents.handleInput,
    [DomEventType.Blur]: ViewletFindWidgetEvents.handleInputBlur,
    [DomEventType.Focus]: ViewletFindWidgetEvents.handleFocus,
  })
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.Click]: ViewletFindWidgetEvents.handleClick,
  })
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

export const dispose = () => {}
