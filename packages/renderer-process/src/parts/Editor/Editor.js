// TODO so many things in this file

import * as Assert from '../Assert/Assert.js'
import * as EditorEvents from './EditorEvents.js'
import * as LayerCursor from './LayerCursor.js'
import * as LayerDiagnostics from './LayerDiagnostics.js'
import * as LayerScrollBar from './LayerScrollBar.js'
import * as LayerSelections from './LayerSelections.js'
import * as LayerText3 from './LayerText.js'
// TODO go back to edit mode after pressing escape so screenreaders can navigate https://stackoverflow.com/questions/53909477/how-to-handle-tabbing-for-accessibility-with-a-textarea-that-uses-the-tab-button

// TODO tree shake out mobile support when targeting electron -> less code -> less event listeners -> less memory -> less cpu

// TODO all create functions should have no arguments
// and be split into two parts
// 1. create -> only create dom elements
// 2. render -> fill elements with attributes and data
// that way all dom nodes can be recycled
export const create = () => {
  const $EditorInput = document.createElement('textarea')
  $EditorInput.className = 'EditorInput'
  $EditorInput.ariaAutoComplete = 'list'
  $EditorInput.ariaRoleDescription = 'editor'
  $EditorInput.ariaMultiLine = 'true'
  $EditorInput.setAttribute('autocomplete', 'off')
  $EditorInput.setAttribute('autocapitalize', 'off')
  $EditorInput.setAttribute('autocorrect', 'off')
  $EditorInput.setAttribute('wrap', 'off')
  $EditorInput.setAttribute('spellcheck', 'false')
  // @ts-ignore
  $EditorInput.role = 'textbox'
  $EditorInput.onpaste = EditorEvents.handlePaste
  // TODO where to best put listeners (side effects)
  $EditorInput.addEventListener('beforeinput', EditorEvents.handleBeforeInput)
  $EditorInput.addEventListener(
    'compositionstart',
    EditorEvents.handleCompositionStart
  )
  $EditorInput.addEventListener(
    'compositionupdate',
    EditorEvents.handleCompositionUpdate
  )
  $EditorInput.addEventListener(
    'compositionend',
    EditorEvents.handleCompositionEnd
  )
  $EditorInput.onfocus = EditorEvents.handleFocus
  $EditorInput.onblur = EditorEvents.handleBlur
  $EditorInput.oncut = EditorEvents.handleCut

  const $LayerCursor = document.createElement('div')
  $LayerCursor.className = 'LayerCursor'

  const $LayerText = document.createElement('div')
  $LayerText.className = 'EditorRows'

  $LayerText.addEventListener('mousedown', EditorEvents.handleMouseDown)

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'
  $ScrollBarThumb.onpointerdown = EditorEvents.handleScrollBarThumbPointerDown

  // TODO only create $ScrollBarDiagnostics lazily when there are actually diagnostics
  const $ScrollBarDiagnostics = document.createElement('div')
  $ScrollBarDiagnostics.className = 'EditorScrollBarDiagnostics'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar'
  $ScrollBar.onmousedown = EditorEvents.handleScrollBarMouseDown
  $ScrollBar.oncontextmenu = EditorEvents.handleScrollBarContextMenu
  $ScrollBar.append($ScrollBarThumb)

  // $EditorRows.addEventListener('mousemove', handleMouseMove, { passive: true })

  // TODO function should be hoisted (maybe -> one listener for all editors (definitely))
  // only problem is $EditorInput closure

  // TODO when mousedown on completions -> this shouldn't be called

  const $LayerSelections = document.createElement('div')
  $LayerSelections.className = 'Selections'

  // TODO maybe use css grid to position layers on top of each other
  // TODO maybe merge layerDiagnostics with LayerSelections
  // TODO maybe this should be more generic, e.g. LayerDecorations
  // where decoration = {top,left, width, height, type/className}
  const $LayerDiagnostics = document.createElement('div')
  $LayerDiagnostics.className = 'LayerDiagnostics'

  const $EditorLayers = document.createElement('div')
  $EditorLayers.className = 'EditorLayers'
  $EditorLayers.append(
    $LayerSelections,
    $LayerText,
    $LayerCursor,
    $LayerDiagnostics
  )

  const $Editor = document.createElement('div')
  $Editor.className = 'Viewlet Editor'
  $Editor.dataset.viewletId = 'EditorText'
  // @ts-ignore
  $Editor.role = 'code'
  $Editor.append($EditorInput, $EditorLayers, $ScrollBarDiagnostics, $ScrollBar)
  $Editor.addEventListener('contextmenu', EditorEvents.handleContextMenu)
  $Editor.addEventListener('wheel', EditorEvents.handleWheel, { passive: true })
  $Editor.addEventListener('mousemove', EditorEvents.handlePointerMove, {
    passive: true,
  })
  return {
    $LayerCursor,
    $LayerSelections,
    $LayerText,
    $EditorLayers,
    $Editor,
    $EditorInput,
    $ScrollBarThumb,
    $LayerDiagnostics,
    $ScrollBarDiagnostics,
    shouldIgnoreSelectionChange: false,
    $Viewlet: $Editor,
  }
}

export const setText = (state, textInfos) => {
  LayerText3.setLineInfos(state, textInfos)
}

export const setSettings = (state, fontSize, lineHeight, letterSpacing) => {
  // TODO many properties on <html> element in chrome devtools looks ugly
  // maybe put styles into a stylesheet instead of using inline styles?
  const root = document.documentElement
  root.style.setProperty('--EditorFontSize', `${fontSize}px`)
  root.style.setProperty('--EditorLineHeight', `${lineHeight}px`)
  root.style.setProperty('--EditorLetterSpacing', letterSpacing)
}

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  LayerScrollBar.setPosition(state, scrollBarY, scrollBarHeight)
}

export const renderCursors = (state, cursorInfos) => {
  LayerCursor.setCursors(state, cursorInfos)
}

export const renderSelections = (state, selectionInfos) => {
  LayerSelections.setSelections(state, selectionInfos)
}

export const renderTextAndCursors = (state, textInfos, cursorInfos) => {
  LayerText3.setLineInfos(state, textInfos)
  LayerCursor.setCursors(state, cursorInfos)
}

export const setSelections = (state, cursorInfos, selectionInfos) => {
  LayerCursor.setCursors(state, cursorInfos)
  LayerSelections.setSelections(state, selectionInfos)
}

export const renderTextAndCursorsAndSelections = (
  state,
  scrollBarY,
  scrollBarHeight,
  textInfos,
  cursorInfos,
  selectionInfos
) => {
  Assert.object(state)
  Assert.number(scrollBarY)
  Assert.number(scrollBarHeight)
  Assert.array(textInfos)
  Assert.array(cursorInfos)
  Assert.array(selectionInfos)
  LayerScrollBar.setPosition(state, scrollBarY, scrollBarHeight)
  LayerText3.setLineInfos(state, textInfos)
  LayerCursor.setCursors(state, cursorInfos)
  LayerSelections.setSelections(state, selectionInfos)
}

// TODO this should be in editor
const getColumnWidth = () => {
  const testSpan = document.createElement('span')
  testSpan.textContent = 'a'
  testSpan.style.fontSize = '15px'
  testSpan.style.letterSpacing = '0.5px'
  testSpan.style.position = 'fixed'
  testSpan.style.fontFamily = "'Fira Code'"
  document.body.append(testSpan)
  const result = Number.parseFloat(getComputedStyle(testSpan).width) / 1
  testSpan.remove()
  return result
}

export const mount = (state, $Parent) => {
  $Parent.append(state.$Editor)
}

export const dispose = (state) => {}

export const focus = (state) => {
  const { $EditorInput } = state
  if (!$EditorInput.isConnected) {
    console.warn('unmounted editor cannot be focused')
  }
  $EditorInput.focus()
}

export const setLanguageId = async (state, languageId) => {
  // state.languageId = languageId
  // state.$Editor.dataset.languageId = languageId
  // loadTokenizer(languageId)
}

export const renderDiagnostics = (state, diagnostics, scrollBarDiagnostics) => {
  LayerDiagnostics.setDiagnostics(state, diagnostics)
  LayerScrollBar.setDiagnostics(state, scrollBarDiagnostics)
}
