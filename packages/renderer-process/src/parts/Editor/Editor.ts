// TODO so many things in this file

import * as AriaAutoCompleteType from '../AriaAutoCompleteType/AriaAutoCompleteType.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as Logger from '../Logger/Logger.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
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
  $EditorInput.ariaAutoComplete = AriaAutoCompleteType.List
  $EditorInput.ariaRoleDescription = AriaRoleDescriptionType.Editor
  $EditorInput.ariaMultiLine = AriaBoolean.True
  $EditorInput.setAttribute('autocomplete', 'off')
  $EditorInput.setAttribute('autocapitalize', 'off')
  $EditorInput.setAttribute('autocorrect', 'off')
  $EditorInput.setAttribute('wrap', 'off')
  $EditorInput.setAttribute('spellcheck', AriaBoolean.False)
  $EditorInput.role = AriaRoles.TextBox
  // TODO where to best put listeners (side effects)
  AttachEvents.attachEvents($EditorInput, {
    [DomEventType.BeforeInput]: EditorEvents.handleBeforeInput,
    [DomEventType.CompositionStart]: EditorEvents.handleCompositionStart,
    [DomEventType.CompositionUpdate]: EditorEvents.handleCompositionUpdate,
    [DomEventType.CompositionEnd]: EditorEvents.handleCompositionEnd,
    [DomEventType.Focus]: EditorEvents.handleFocus,
    [DomEventType.Blur]: EditorEvents.handleBlur,
    [DomEventType.Cut]: EditorEvents.handleCut,
    [DomEventType.Paste]: EditorEvents.handlePaste,
  })
  $EditorInput.name = 'editor'

  const $LayerCursor = document.createElement('div')
  $LayerCursor.className = 'LayerCursor'

  const $LayerText = document.createElement('div')
  $LayerText.className = 'EditorRows'

  const $LayerGutter = document.createElement('div')
  $LayerGutter.className = 'Gutter'

  AttachEvents.attachEvents($LayerText, {
    [DomEventType.MouseDown]: EditorEvents.handleMouseDown,
    [DomEventType.PointerDown]: EditorEvents.handleEditorPointerDown,
  })

  const $ScrollBarThumbVertical = document.createElement('div')
  $ScrollBarThumbVertical.className = 'ScrollBarThumb ScrollBarThumbVertical'

  // TODO only create $ScrollBarDiagnostics lazily when there are actually diagnostics
  const $ScrollBarDiagnostics = document.createElement('div')
  $ScrollBarDiagnostics.className = 'EditorScrollBarDiagnostics'

  const $ScrollBarVertical = document.createElement('div')
  $ScrollBarVertical.className = 'ScrollBar ScrollBarVertical'
  AttachEvents.attachEvents($ScrollBarVertical, {
    [DomEventType.PointerDown]: EditorEvents.handleScrollBarVerticalPointerDown,
    [DomEventType.ContextMenu]: EditorEvents.handleScrollBarContextMenu,
  })
  $ScrollBarVertical.append($ScrollBarThumbVertical)

  const $ScrollBarThumbHorizontal = document.createElement('div')
  $ScrollBarThumbHorizontal.className = 'ScrollBarThumb ScrollBarThumbHorizontal'

  const $ScrollBarHorizontal = document.createElement('div')
  $ScrollBarHorizontal.className = 'ScrollBar ScrollBarHorizontal'
  $ScrollBarHorizontal.append($ScrollBarThumbHorizontal)
  AttachEvents.attachEvents($ScrollBarHorizontal, {
    [DomEventType.PointerDown]: EditorEvents.handleScrollBarHorizontalPointerDown,
  })

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

  $EditorLayers.append($LayerSelections, $LayerText, $LayerCursor, $LayerDiagnostics)

  const $EditorContent = document.createElement('div')
  $EditorContent.className = 'EditorContent'
  $EditorContent.append($EditorInput, $EditorLayers, $ScrollBarDiagnostics, $ScrollBarVertical, $ScrollBarHorizontal)
  $EditorContent.addEventListener('mousemove', EditorEvents.handleMouseMove, DomEventOptions.Passive)

  const $Editor = document.createElement('div')
  $Editor.className = 'Viewlet Editor'
  $Editor.role = AriaRoles.Code
  $Editor.append($LayerGutter, $EditorContent)
  AttachEvents.attachEvents($Editor, {
    [DomEventType.ContextMenu]: EditorEvents.handleContextMenu,
  })
  $Editor.addEventListener(DomEventType.Wheel, EditorEvents.handleWheel, DomEventOptions.Passive)
  // $Editor.addEventListener(DomEventType.MouseMove, EditorEvents.handlePointerMove, DomEventOptions.Passive)
  return {
    $LayerCursor,
    $LayerSelections,
    $LayerText,
    $LayerGutter,
    $EditorLayers,
    $Editor,
    $EditorInput,
    $ScrollBarThumbVertical,
    $ScrollBarThumbHorizontal,
    $LayerDiagnostics,
    $ScrollBarDiagnostics,
    shouldIgnoreSelectionChange: false,
    $Viewlet: $Editor,
  }
}

export const setText = (state, dom) => {
  LayerText3.setLineInfos(state, dom)
}

export const setIncrementalEdits = (state, incrementalEdits) => {
  const { $LayerText } = state
  for (const incrementalEdit of incrementalEdits) {
    const { rowIndex, columnIndex, text } = incrementalEdit
    const $Row = $LayerText.children[rowIndex]
    const $Column = $Row.children[columnIndex]
    if ($Column.firstChild) {
      $Column.firstChild.nodeValue = text
    } else {
      $Column.textContent = text
    }
  }
}

export const setSettings = (state, fontSize, lineHeight, letterSpacing) => {
  // TODO many properties on <html> element in chrome devtools looks ugly
  // maybe put styles into a stylesheet instead of using inline styles?
  const root = document.documentElement
  root.style.setProperty('--EditorFontSize', `${fontSize}px`)
  root.style.setProperty('--EditorLineHeight', `${lineHeight}px`)
  root.style.setProperty('--EditorLetterSpacing', `${letterSpacing}px`)
}

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  LayerScrollBar.setPosition(state, scrollBarY, scrollBarHeight)
}

export const setScrollBarHorizontal = LayerScrollBar.setScrollBarHorizontal

export const renderCursors = (state, cursorInfos) => {
  LayerCursor.setCursors(state, cursorInfos)
}

export const renderGutter = (state, dom) => {
  const { $LayerGutter } = state
  VirtualDom.renderInto($LayerGutter, dom)
}

export const renderSelections = (state, selectionInfos) => {
  LayerSelections.setSelections(state, selectionInfos)
}

export const renderTextAndCursors = (state, textInfos, cursorInfos) => {
  LayerText3.setLineInfos(state, textInfos)
  LayerCursor.setCursors(state, cursorInfos)
}

export const setSelections = (state, cursorInfos, selectionInfos) => {
  Assert.array(cursorInfos)
  Assert.array(selectionInfos)
  LayerCursor.setCursors(state, cursorInfos)
  LayerSelections.setSelections(state, selectionInfos)
}

export const renderTextAndCursorsAndSelections = (state, scrollBarY, scrollBarHeight, textInfos, cursorInfos, selectionInfos) => {
  Assert.object(state)
  Assert.string(scrollBarY)
  Assert.string(scrollBarHeight)
  Assert.array(textInfos)
  Assert.array(cursorInfos)
  Assert.array(selectionInfos)
  LayerScrollBar.setPosition(state, scrollBarY, scrollBarHeight)
  LayerText3.setLineInfos(state, textInfos)
  LayerCursor.setCursors(state, cursorInfos)
  LayerSelections.setSelections(state, selectionInfos)
}

export const mount = (state, $Parent) => {
  $Parent.append(state.$Editor)
}

export const dispose = (state) => {}

export const setFocused = (state, isFocused) => {
  const { $EditorInput } = state
  if (!$EditorInput.isConnected) {
    Logger.warn('unmounted editor cannot be focused')
  }
  if (isFocused) {
    $EditorInput.focus()
  }
}

export const renderDiagnostics = (state, diagnostics, scrollBarDiagnostics) => {
  // @ts-ignore
  LayerDiagnostics.setDiagnostics(state, diagnostics)
  LayerScrollBar.setDiagnostics(state, scrollBarDiagnostics)
}

export const setDecorationsDom = (state, decorations) => {
  LayerDiagnostics.setDecorationsDom(state, decorations)
}
