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
  const { button, clientX, clientY } = event
  EditorFunctions.handleContextMenu(button, clientX, clientY)
}

export const handleFocus = (event) => {
  Focus.setFocus('EditorText')
}

export const handleBlur = (event) => {
  // needed for save on blur
  // also needed to close completions on blur
  EditorFunctions.handleBlur()
}

/**
 *
 * @param {InputEvent} event
 */
export const handleBeforeInput = (event) => {
  Event.preventDefault(event)
  const { inputType, data, target } = event
  const uid = ComponentUid.get(target)
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
  const { data } = event
  EditorFunctions.compositionStart(data)
}

export const handleCompositionUpdate = (event) => {
  const { data } = event
  EditorFunctions.compositionUpdate(data)
}

export const handleCompositionEnd = (event) => {
  const { data } = event
  EditorFunctions.compositionEnd(data)
}

export const handleCut = (event) => {
  Event.preventDefault(event)
  EditorFunctions.cut()
}

const isRightClick = (event) => {
  return event.button === MouseEventType.RightClick
}

export const handleEditorPointerMove = (event) => {
  const { clientX, clientY, altKey, target } = event
  const uid = ComponentUid.get(target)
  // TODO if/else should be in renderer worker
  if (altKey) {
    EditorFunctions.moveRectangleSelectionPx(uid, clientX, clientY)
  } else {
    EditorFunctions.moveSelectionPx(uid, clientX, clientY)
  }
}

export const handleEditorLostPointerCapture = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleEditorPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handleEditorLostPointerCapture)
  const uid = ComponentUid.get(target)
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
  Event.preventDefault(event)
  const { clientX, clientY, detail, target } = event
  const uid = ComponentUid.get(target)
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
  const { deltaMode, deltaY, target } = event
  // TODO send editor id
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
    case WheelEventType.DomDeltaPixel:
      EditorFunctions.setDeltaY(deltaY)
      break
    default:
      break
  }
}

export const handlePaste = (event) => {
  Event.preventDefault(event)
  const { clipboardData } = event
  const text = ClipBoardData.getText(clipboardData)
  EditorFunctions.paste(text)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  EditorFunctions.handleScrollBarMove(clientY)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  // @ts-ignore
  target.releasePointerCapture(pointerId)
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove)
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerUp, handleScrollBarPointerUp)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  // @ts-ignore
  target.setPointerCapture(pointerId)
  // @ts-ignore
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove, DomEventOptions.Active)
  // TODO use pointerlost event instead
  // @ts-ignore
  target.addEventListener(DomEventType.PointerUp, handleScrollBarPointerUp)
  EditorFunctions.handleScrollBarPointerDown(clientY)
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
