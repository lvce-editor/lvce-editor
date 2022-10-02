import * as Editor from '../Editor/Editor.js'
import * as Widget from '../Widget/Widget.js'

export const create = Editor.create

export const setText = Editor.setText

export const setSelections = Editor.setSelections

export const handleError = (state, error) => {
  state.$Viewlet.textContent = error
}

export const setScrollBar = Editor.setScrollBar

export const highlightAsLink = (state, relativeY, tokenIndex) => {
  const $Row = state.$LayerText.children[relativeY]
  if (!$Row) {
    console.info('no row found')
    return
  }
  const $Token = $Row.children[tokenIndex + 1]
  console.log($Token)
  $Token.classList.add('EditorGoToDefinitionLink')
  // console.log({ state, tokenIndex, relativeY })
}

export const showOverlayMessage = (state, x, y, content) => {
  const $OverLayMessage = document.createElement('div')
  $OverLayMessage.className = 'EditorOverlayMessage'
  $OverLayMessage.style.position = 'fixed'
  $OverLayMessage.textContent = content
  $OverLayMessage.style.top = `${y}px`
  $OverLayMessage.style.left = `${x}px`
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

export const focus = Editor.focus
