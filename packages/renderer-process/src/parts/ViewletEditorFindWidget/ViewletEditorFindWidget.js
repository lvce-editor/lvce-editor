import * as Focus from '../Focus/Focus.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletEditorFindWidgetEvents from './ViewletEditorFindWidgetEvents.js'

export const name = 'EditorFindWidget'

const UiStrings = {
  Close: 'Close',
  PreviousMatch: 'Previous Match',
  NextMatch: 'Next Match',
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
  $Viewlet.onclick = ViewletEditorFindWidgetEvents.handleClick
  $Viewlet.className = 'Viewlet EditorFindWidget'
  // @ts-ignore
  $Viewlet.role = 'group'
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

export const css = '/css/parts/ViewletEditorFindWidget.css'
