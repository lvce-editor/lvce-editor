import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletEditorFindWidgetEvents from './ViewletEditorFindWidgetEvents.js'
import * as Focus from '../Focus/Focus.js'
import * as Icon from '../Icon/Icon.js'

export const name = 'EditorFindWidget'

const UiStrings = {
  Close: 'Close',
  PreviousMatch: 'Previous Match',
  NextMatch: 'Next Match',
}

const create$Button = (label, icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  $Icon.style.webkitMaskImage = `url('${icon}')`
  // @ts-ignore
  $Icon.role = 'none'

  const $Button = document.createElement('div')
  // @ts-ignore
  $Button.role = 'button'
  $Button.ariaLabel = label
  $Button.title = label
  $Button.tabIndex = 0
  $Button.className = `EditorFindWidgetButton`
  $Button.append($Icon)
  return $Button
}

export const create = () => {
  // TODO recycle nodes
  const $InputBox = InputBox.create()
  $InputBox.oninput = ViewletEditorFindWidgetEvents.handleInput
  $InputBox.ariaLabel = 'Find'

  const $MatchCountText = document.createTextNode('')
  const $MatchCount = document.createElement('div')
  $MatchCount.className = 'EditorFindWidgetMatchCount'
  $MatchCount.append($MatchCountText)

  const $ButtonFocusNext = create$Button(UiStrings.NextMatch, Icon.NextMatch)
  const $ButtonFocusPrevious = create$Button(
    UiStrings.PreviousMatch,
    Icon.PreviousMatch
  )
  const $ButtonClose = create$Button(UiStrings.Close, Icon.Close)

  const $Viewlet = document.createElement('div')
  $Viewlet.onclick = ViewletEditorFindWidgetEvents.handleClick
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'EditorFindWidget'
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
  Focus.setFocus('EditorFindWidget')
}

export const setValue = (state, value) => {
  const { $InputBox } = state
  $InputBox.value = value
}

export const setMatchCountText = (state, value) => {
  const { $MatchCountText } = state
  $MatchCountText.nodeValue = value
}

export const dispose = () => {}
