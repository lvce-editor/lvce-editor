import * as Editor from '../Editor/Editor.ts'
import * as Logger from '../Logger/Logger.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as Widget from '../Widget/Widget.ts'

export const create = Editor.create

export const setText = Editor.setText

export const setSelections = Editor.setSelections

export const setIncrementalEdits = Editor.setIncrementalEdits

export const handleError = (state, error) => {
  state.$Viewlet.textContent = error
}

export const setScrollBar = Editor.setScrollBar

export const renderGutter = Editor.renderGutter

export const setScrollBarHorizontal = Editor.setScrollBarHorizontal

export const highlightAsLink = (state, relativeY, tokenIndex) => {
  const $Row = state.$LayerText.children[relativeY]
  if (!$Row) {
    Logger.info('no row found')
    return
  }
  const $Token = $Row.children[tokenIndex + 1]
  $Token.classList.add('EditorGoToDefinitionLink')
}

export const showOverlayMessage = (state, x, y, content) => {
  const $OverLayMessage = document.createElement('div')
  $OverLayMessage.className = 'EditorOverlayMessage'
  $OverLayMessage.style.position = 'fixed'
  $OverLayMessage.textContent = content
  SetBounds.setXAndY($OverLayMessage, x, y)
  Widget.append($OverLayMessage)
}

export const hideOverlayMessage = (state) => {
  // TODO pass id of the overlay message and remove widget by id
  for (const $Widget of Widget.state.widgetSet) {
    if ($Widget.className === 'EditorOverlayMessage') {
      Widget.remove($Widget)
    }
  }
}

export const setFocused = Editor.setFocused

export const focus = Editor.setFocused

export const setDecorationsDom = Editor.setDecorationsDom
