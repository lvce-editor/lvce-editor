import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletEditorFindWidgetEvents from './ViewletEditorFindWidgetEvents.js'
import * as Focus from '../Focus/Focus.js'

export const name = 'EditorFindWidget'

export const create = () => {
  // TODO recycle nodes
  const $InputBox = InputBox.create()
  $InputBox.oninput = ViewletEditorFindWidgetEvents.handleInput

  const $MatchCountText = document.createTextNode('')
  const $MatchCount = document.createElement('div')
  $MatchCount.className = 'EditorFindWidgetMatchCount'
  $MatchCount.append($MatchCountText)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'EditorFindWidget'
  $Viewlet.append($InputBox, $MatchCount)
  return {
    $Viewlet,
    $InputBox,
    $MatchCount,
    $MatchCountText,
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
