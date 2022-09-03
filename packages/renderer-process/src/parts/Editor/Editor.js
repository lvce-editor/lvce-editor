// TODO so many things in this file

import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as ModifierKey from '../ModifierKey/ModifierKey.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as LayerCursor from './LayerCursor.js'
import * as LayerDiagnostics from './LayerDiagnostics.js'
import * as LayerScrollBar from './LayerScrollBar.js'
import * as LayerSelections from './LayerSelections.js'
import * as LayerText3 from './LayerText.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as InputEventType from '../InputEventType/InputEventType.js'

// TODO go back to edit mode after pressing escape so screenreaders can navigate https://stackoverflow.com/questions/53909477/how-to-handle-tabbing-for-accessibility-with-a-textarea-that-uses-the-tab-button

// TODO tree shake out mobile support when targeting electron -> less code -> less event listeners -> less memory -> less cpu

const handleContextMenu = (event) => {
  event.preventDefault()
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'editor'
  )
}

const handleFocus = (event) => {
  Focus.setFocus('EditorText')
}

const handleBlur = (event) => {
  // needed for save on blur
  // also needed to close completions on blur
  RendererWorker.send(/* EditorBlur.editorBlur */ 'Editor.blur')
}

/**
 *
 * @param {InputEvent} event
 */
const handleBeforeInput = (event) => {
  event.preventDefault()
  switch (event.inputType) {
    case InputEventType.InsertText:
      RendererWorker.send(
        /* Editor.type */ 'Editor.type',
        /* text */ event.data
      )
      break
    default:
      break
  }
  // if (!event.data) {
  //   return
  // }
}

// TODO composition should be better supported,
// for example
// - gedit draws a line below the composed text
// - codemirror 6 also draws that line
// - codemirror 5 also draws that line
// - vscode does not draw a line, but displays characters during composition

const handleCompositionStart = (event) => {
  RendererWorker.send(
    /* Editor.compositionStart */ 'Editor.compositionStart',
    /* text */ event.data
  )
}

const handleCompositionUpdate = (event) => {
  RendererWorker.send(
    /* Editor.compositionUpdate */ 'Editor.compositionUpdate',
    /* text */ event.data
  )
}

const handleCompositionEnd = (event) => {
  RendererWorker.send(
    /* Editor.compositionEnd */ 'Editor.compositionEnd',
    /* text */ event.data
  )
}

const handleCut = (event) => {
  event.preventDefault()
  RendererWorker.send(/* Editor.cut */ 'Editor.cut')
}

const handleSelectionMove = (event) => {
  const x = event.clientX
  const y = event.clientY
  const totalOffset = getTotalOffset(event)
  if (event.altKey) {
    RendererWorker.send(
      /* Editor.moveRectangleSelectionPx */ 'Editor.moveRectangleSelectionPx',
      /* x */ x,
      /* y */ y,
      /* offset */ totalOffset
    )
  } else {
    RendererWorker.send(
      /* Editor.moveSelectionPx */ 'Editor.moveSelectionPx',
      /* x */ x,
      /* y */ y,
      /* offset */ totalOffset
    )
  }
}

const handleSelectionDone = (event) => {
  document.removeEventListener('mousemove', handleSelectionMove)
  document.removeEventListener('mouseup', handleSelectionDone)
}

const getModifier = (event) => {
  if (event.ctrlKey) {
    return ModifierKey.Ctrl
  }
  if (event.altKey) {
    return ModifierKey.Alt
  }
  return ModifierKey.None
}

const handleSingleClick = (event, x, y, offset) => {
  console.log('click', { x, y, offset })
  const modifier = getModifier(event)
  RendererWorker.send(
    /* Editor.handleSingleClick */ 'Editor.handleSingleClick',
    /* modifier */ modifier,
    /* x */ x,
    /* y */ y,
    /* offset */ offset
  )
  const $Target = event.target
  // const $InputBox = $Target.closest('.Editor').firstElementChild
  // $InputBox.focus()
  // TODO this logic should be in renderer worker
  document.addEventListener('mousemove', handleSelectionMove, { passive: true })
  document.addEventListener('mouseup', handleSelectionDone)
}

const handleDoubleClick = (event, x, y, offset) => {
  RendererWorker.send(
    /* Editor.handleDoubleClick */ 'Editor.handleDoubleClick',
    /* x */ x,
    /* y */ y,
    /* offset */ offset
  )
}

const handleTripleClick = (event, x, y, offset) => {
  RendererWorker.send(
    /* Editor.handleTripleClick */ 'Editor.handleTripleClick',
    /* x */ x,
    /* y */ y,
    /* offset */ offset
  )
}

const isRightClick = (event) => {
  return event.button === MouseEventType.RightClick
}

const getTextNodeOffset = (textNode) => {
  let $Token = textNode.parentElement
  let offset = 0
  while ($Token.previousSibling) {
    $Token = $Token.previousSibling
    offset += $Token.textContent.length
  }
  return offset
}

const getTotalOffset = (event) => {
  if (document.caretRangeFromPoint) {
    // chrome uses deprecated version
    const range = document.caretRangeFromPoint(event.clientX, event.clientY)
    if (!range) {
      return 0
    }
    const textNode = range.startContainer
    const textNodeOffset = getTextNodeOffset(textNode)
    const offset = range.startOffset
    const totalOffset = textNodeOffset + offset
    return totalOffset
    // @ts-ignore
  }
  // @ts-ignore
  if (document.caretPositionFromPoint) {
    // firefox uses new version
    // @ts-ignore
    const range = document.caretPositionFromPoint(event.clientX, event.clientY)
    if (!range) {
      return 0
    }
    const textNode = range.offsetNode
    const textNodeOffset = getTextNodeOffset(textNode)
    const offset = range.offset
    const totalOffset = textNodeOffset + offset
    return totalOffset
  }
  throw new Error('caret position is not supported')
}

const handleMouseDown = (event) => {
  if (isRightClick(event)) {
    return
  }
  event.preventDefault()
  const totalOffset = getTotalOffset(event)
  const x = event.clientX
  const y = event.clientY
  console.log('detail', event.detail)
  switch (event.detail) {
    case 1:
      handleSingleClick(event, x, y, totalOffset)
      break
    case 2:
      handleDoubleClick(event, x, y, totalOffset)
      break
    case 3:
      handleTripleClick(event, x, y, totalOffset)
      break
    default:
      break
  }
}

// TODO figure out whether it is possible to register hover provider without mousemove
// mousemove handler is called very often and could slow down editor / drain battery

// disabled for now because of constant cpu usage on mousemove
// bad for performance
const handleMouseMove = (event) => {
  const x = event.clientX
  const y = event.clientY
  if (event.altKey) {
    const offset = getTotalOffset(event)
    RendererWorker.send(
      /* Editor.handleMouseMoveWithAltKey */ 'Editor.handleMouseMoveWithAltKey',
      /* x */ x,
      /* y */ y,
      /* offset */ offset
    )
  }
  // console.log(event.altKey)
  // RendererWorker.send(/* Editor.handleMouseMove */ 389, /* x */ x, /* y */ y)
}

/**
 *
 * @param {WheelEvent} event
 */
const handleWheel = (event) => {
  // event.preventDefault()
  // const state = EditorHelper.getStateFromEvent(event)
  // TODO send editor id
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* Editor.setDeltaY */ 'Editor.setDeltaY',
        /* value */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* Editor.setDeltaY */ 'Editor.setDeltaY',
        /* value */ event.deltaY
      )
      break
    default:
      break
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const text = event.clipboardData.getData('text')
  RendererWorker.send(/* Editor.paste */ 'Editor.paste', /* text */ text)
}

const handleScrollBarThumbMouseMove = (event) => {
  const y = event.clientY
  RendererWorker.send(
    /* Editor.handleScrollBarMouseMove */ 'Editor.handleScrollBarMove',
    /* y */ y
  )
}

const handleScrollBarThumbMouseUp = () => {
  window.removeEventListener('mousemove', handleScrollBarThumbMouseMove)
  window.removeEventListener('mouseup', handleScrollBarThumbMouseUp)
}

const handleScrollBarThumbMouseDown = (event) => {
  window.addEventListener('mousemove', handleScrollBarThumbMouseMove)
  window.addEventListener('mouseup', handleScrollBarThumbMouseUp)
}

const handleScrollBarMouseDown = (event) => {
  const y = event.clientY
  RendererWorker.send(
    /* EditorHandleScrollBarClick.editorHandleScrollBarClick */ 'Editor.handleScrollBarClick',
    /* y */ y
  )
}

const toSimpleTouch = (touch) => {
  return {
    x: touch.clientX,
    y: touch.clientY,
  }
}

const toSimpleTouchEvent = (event) => {
  const touches = Array.from(event.touches).map(toSimpleTouch)
  const changedTouches = Array.from(event.changedTouches).map(toSimpleTouch)
  return {
    touches,
    changedTouches,
  }
}

// TODO add touch cancel handler

// TODO use touch events for scrolling

const handleTouchStart = (event) => {
  const touchEvent = toSimpleTouchEvent(event)
  RendererWorker.send(
    /* EditorHandleTouchStart.editorHandleTouchStart */ 'Editor.handleTouchStart',
    /* touchEvent */ touchEvent
  )
}

const handleTouchMove = (event) => {
  const touchEvent = toSimpleTouchEvent(event)
  RendererWorker.send(
    /* EditorHandleTouchMove.editorHandleTouchMove */ 'Editor.handleTouchMove',
    /* touchEvent */ touchEvent
  )
}

const handleTouchEnd = (event) => {
  if (event.cancelable) {
    event.preventDefault()
  }
  const touchEvent = toSimpleTouchEvent(event)
  RendererWorker.send(
    /* EditorHandleTouchEnd.editorHandleTouchEnd */ 'Editor.handleTouchEnd',
    /* touchEvent */ touchEvent
  )
}

const getRangeFromSelection = (selection) => {
  if (!selection.anchorNode) {
    return undefined
  }
  const $StartToken = selection.anchorNode.parentNode
  const $EndToken = selection.focusNode.parentNode
  const $StartRow = $StartToken.parentNode
  const $EndRow = $EndToken.parentNode
  const $Rows = $StartRow.parentNode
  let startRowIndex = 0
  for (let i = 0; i < $Rows.children.length; i++) {
    if ($Rows.children[i] === $StartRow) {
      startRowIndex = i
      break
    }
  }
  let startColumnIndex = 0
  for (let i = 0; i < $StartRow.children.length; i++) {
    if ($StartRow.children[i] === $StartToken) {
      break
    }
    startColumnIndex += $StartRow.children[i].textContent.length
  }
  startColumnIndex += selection.anchorOffset
  let endRowIndex = 0
  for (let i = 0; i < $Rows.children.length; i++) {
    if ($Rows.children[i] === $EndRow) {
      endRowIndex = i
      break
    }
  }
  let endColumnIndex = 0
  for (let i = 0; i < $EndRow.children.length; i++) {
    if ($EndRow.children[i] === $EndToken) {
      break
    }
    endColumnIndex += $EndRow.children[i].textContent.length
  }
  endColumnIndex += selection.focusOffset
  return {
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex,
  }
}

const handleContentEditableBeforeInput = (event) => {
  const selection = document.getSelection()
  const range = getRangeFromSelection(selection)
  if (!range) {
    console.error('[Editor] cannot handle input event without selection')
    return
  }
  RendererWorker.send(
    /* EditorHandleBeforeInputFromContentEditable.editorHandleBeforeInputFromContentEditable */ 'Editor.handleBeforeInputFromContentEditable',
    /* data */ event.data || '',
    /* range */ range
  )
}

const handleNativeSelectionChange = (event) => {
  // if (state.shouldIgnoreSelectionChange) {
  //   state.shouldIgnoreSelectionChange = false
  //   return
  // }
  // const selection = document.getSelection()
  // const range = getRangeFromSelection(selection)
  // if (!range) {
  //   return
  // }
  // RendererWorker.send(
  //   /* EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange */ 'Editor.handleNativeSelectionChange',
  //   /* range */ range
  // )
}

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
  $EditorInput.onpaste = handlePaste
  // TODO where to best put listeners (side effects)
  $EditorInput.addEventListener('beforeinput', handleBeforeInput)
  $EditorInput.addEventListener('compositionstart', handleCompositionStart)
  $EditorInput.addEventListener('compositionupdate', handleCompositionUpdate)
  $EditorInput.addEventListener('compositionend', handleCompositionEnd)
  $EditorInput.onfocus = handleFocus
  $EditorInput.onblur = handleBlur
  $EditorInput.oncut = handleCut

  const $LayerCursor = document.createElement('div')
  $LayerCursor.className = 'LayerCursor'

  const $LayerText = document.createElement('div')
  $LayerText.className = 'EditorRows'

  $LayerText.addEventListener('mousedown', handleMouseDown)

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'
  $ScrollBarThumb.addEventListener('mousedown', handleScrollBarThumbMouseDown)

  // TODO only create $ScrollBarDiagnostics lazily when there are actually diagnostics
  const $ScrollBarDiagnostics = document.createElement('div')
  $ScrollBarDiagnostics.className = 'EditorScrollBarDiagnostics'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar'
  $ScrollBar.onmousedown = handleScrollBarMouseDown
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
  $Editor.addEventListener('contextmenu', handleContextMenu)
  $Editor.addEventListener('wheel', handleWheel, { passive: true })
  $Editor.addEventListener('mousemove', handleMouseMove, { passive: true })
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
