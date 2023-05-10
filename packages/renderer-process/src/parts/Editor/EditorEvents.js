// TODO so many things in this file

import * as ClipBoardData from '../ClipBoardData/ClipBoardData.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as GetModifierKey from '../GetModifierKey/GetModifierKey.js'
import * as InputEventType from '../InputEventType/InputEventType.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as TouchEvent from '../TouchEvent/TouchEvent.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as EditorFunctions from './EditorFunctions.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.js'

// TODO go back to edit mode after pressing escape so screenreaders can navigate https://stackoverflow.com/questions/53909477/how-to-handle-tabbing-for-accessibility-with-a-textarea-that-uses-the-tab-button

// TODO tree shake out mobile support when targeting electron -> less code -> less event listeners -> less memory -> less cpu

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  const { button, clientX, clientY } = event
  EditorFunctions.handleContextMenu(uid, button, clientX, clientY)
}

export const handleFocus = (event) => {
  Focus.setFocus('EditorText')
}

export const handleBlur = (event) => {
  // needed for save on blur
  // also needed to close completions on blur
  const uid = ComponentUid.fromEvent(event)
  EditorFunctions.handleBlur(uid)
}

/**
 *
 * @param {InputEvent} event
 */
export const handleBeforeInput = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  const { inputType, data } = event
  switch (inputType) {
    case InputEventType.InsertText:
      EditorFunctions.typeWithAutoClosing(uid, data)
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

export const handleCompositionStart = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { data } = event
  EditorFunctions.compositionStart(uid, data)
}

export const handleCompositionUpdate = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { data } = event
  EditorFunctions.compositionUpdate(uid, data)
}

export const handleCompositionEnd = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { data } = event
  EditorFunctions.compositionEnd(uid, data)
}

export const handleCut = (event) => {
  Event.preventDefault(event)
  EditorFunctions.cut()
}

const isRightClick = (event) => {
  return event.button === MouseEventType.RightClick
}

export const handleEditorPointerMove = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { clientX, clientY, altKey } = event
  // TODO if/else should be in renderer worker
  if (altKey) {
    EditorFunctions.moveRectangleSelectionPx(uid, clientX, clientY)
  } else {
    EditorFunctions.moveSelectionPx(uid, clientX, clientY)
  }
}

export const handleEditorLostPointerCapture = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleEditorPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handleEditorLostPointerCapture)
  EditorFunctions.handlePointerCaptureLost(uid)
}

export const handleEditorGotPointerCapture = () => {}

/**
 *
 * @param {PointerEvent} event
 */
export const handleEditorPointerDown = (event) => {
  const { target, pointerId } = event
  // @ts-ignore
  target.setPointerCapture(pointerId)
  // @ts-ignore
  target.addEventListener(DomEventType.PointerMove, handleEditorPointerMove, DomEventOptions.Active)
  // @ts-ignore
  target.addEventListener(DomEventType.LostPointerCapture, handleEditorLostPointerCapture)
}

export const handleMouseDown = (event) => {
  if (isRightClick(event)) {
    return
  }
  const uid = ComponentUid.fromEvent(event)
  Event.preventDefault(event)
  const { clientX, clientY, detail } = event
  const modifier = GetModifierKey.getModifierKey(event)
  EditorFunctions.handleMouseDown(uid, modifier, clientX, clientY, detail)
}

// TODO figure out whether it is possible to register hover provider without mousemove
// mousemove handler is called very often and could slow down editor / drain battery

/**
 *
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { deltaMode, deltaX, deltaY } = event
  // event.preventDefault()
  // const state = EditorHelper.getStateFromEvent(event)
  // TODO send editor id
  EditorFunctions.setDelta(uid, deltaMode, deltaX, deltaY)
}

export const handlePaste = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  const { clipboardData } = event
  const text = ClipBoardData.getText(clipboardData)
  EditorFunctions.paste(uid, text)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarThumbVerticalPointerMove = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { clientY } = event
  EditorFunctions.handleScrollBarVerticalMove(uid, clientY)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarVerticalPointerUp = (event) => {
  const { target, pointerId } = event
  // @ts-ignore
  target.releasePointerCapture(pointerId)
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbVerticalPointerMove)
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerUp, handleScrollBarVerticalPointerUp)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarVerticalPointerDown = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target, pointerId, clientY } = event
  // @ts-ignore
  target.setPointerCapture(pointerId)
  // @ts-ignore
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbVerticalPointerMove, DomEventOptions.Active)
  // TODO use pointerlost event instead
  // @ts-ignore
  target.addEventListener(DomEventType.PointerUp, handleScrollBarVerticalPointerUp)
  EditorFunctions.handleScrollBarVerticalPointerDown(uid, clientY)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarThumbHorizontalPointerMove = (event) => {
  const { clientX } = event
  const uid = ComponentUid.fromEvent(event)
  EditorFunctions.handleScrollBarHorizontalMove(uid, clientX)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarHorizontalPointerUp = (event) => {
  const { target, pointerId } = event
  // @ts-ignore
  target.releasePointerCapture(pointerId)
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbHorizontalPointerMove)
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerUp, handleScrollBarHorizontalPointerUp)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarHorizontalPointerDown = (event) => {
  const { target, pointerId, clientX } = event
  // @ts-ignore
  target.setPointerCapture(pointerId)
  // @ts-ignore
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbHorizontalPointerMove, DomEventOptions.Active)
  // TODO use pointerlost event instead
  // @ts-ignore
  target.addEventListener(DomEventType.PointerUp, handleScrollBarHorizontalPointerUp)
  EditorFunctions.handleScrollBarHorizontalPointerDown(clientX)
}

export const handleScrollBarContextMenu = (event) => {
  Event.preventDefault(event)
  Event.stopPropagation(event)
}

// TODO add touch cancel handler

// TODO use touch events for scrolling

export const handleTouchStart = (event) => {
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  EditorFunctions.handleTouchStart(touchEvent)
}

export const handleTouchMove = (event) => {
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  EditorFunctions.handleTouchMove(touchEvent)
}

export const handleTouchEnd = (event) => {
  if (event.cancelable) {
    Event.preventDefault(event)
  }
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  EditorFunctions.handleTouchEnd(touchEvent)
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

export const handleContentEditableBeforeInput = (event) => {
  const selection = document.getSelection()
  const range = getRangeFromSelection(selection)
  if (!range) {
    console.error('[Editor] cannot handle input event without selection')
    return
  }
  EditorFunctions.handleBeforeInputFromContentEditable(event.data || '', range)
}

export const handleNativeSelectionChange = (event) => {
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
