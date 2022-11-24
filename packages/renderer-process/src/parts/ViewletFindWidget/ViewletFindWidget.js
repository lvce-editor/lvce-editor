import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Focus from '../Focus/Focus.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
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
  $InputBox.oninput = ViewletFindWidgetEvents.handleInput
  $InputBox.ariaLabel = UiStrings.Find

  const $MatchCountText = document.createTextNode('')
  const $MatchCount = document.createElement('div')
  $MatchCount.className = 'FindWidgetMatchCount'
  $MatchCount.append($MatchCountText)

  const $ButtonFocusNext = IconButton.create$Button(
    UiStrings.NextMatch,
    Icon.NextMatch
  )
  const $ButtonFocusPrevious = IconButton.create$Button(
    UiStrings.PreviousMatch,
    Icon.PreviousMatch
  )
  const $ButtonClose = IconButton.create$Button(UiStrings.Close, Icon.Close)

  const $Viewlet = document.createElement('div')
  $Viewlet.onclick = ViewletFindWidgetEvents.handleClick
  $Viewlet.className = 'Viewlet FindWidget'
  // @ts-ignore
  $Viewlet.role = AriaRoles.Group
  $Viewlet.append(
    $InputBox,
    $MatchCount,
    $ButtonFocusPrevious,
    $ButtonFocusNext,
    $ButtonClose
  )
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

export const focus = (state) => {
  const { $InputBox } = state
  $InputBox.focus()
  Focus.setFocus('FindWidget')
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
