// TODO so many things in this file

import * as ClipBoardDataType from '../ClipBoardDataType/ClipBoardDataType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as GetModifierKey from '../GetModifierKey/GetModifierKey.js'
import * as InputEventType from '../InputEventType/InputEventType.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as Event from '../Event/Event.js'
import * as TouchEvent from '../TouchEvent/TouchEvent.js'

// TODO go back to edit mode after pressing escape so screenreaders can navigate https://stackoverflow.com/questions/53909477/how-to-handle-tabbing-for-accessibility-with-a-textarea-that-uses-the-tab-button

// TODO tree shake out mobile support when targeting electron -> less code -> less event listeners -> less memory -> less cpu

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  RendererWorker.send(/* ContextMenu.show */ 'ContextMenu.show', /* x */ clientX, /* y */ clientY, /* id */ MenuEntryId.Editor)
}

export const handleFocus = (event) => {
  Focus.setFocus('EditorText')
}

export const handleBlur = (event) => {
  // needed for save on blur
  // also needed to close completions on blur
  RendererWorker.send(/* EditorBlur.editorBlur */ 'Editor.blur')
}

/**
 *
 * @param {InputEvent} event
 */
export const handleBeforeInput = (event) => {
  Event.preventDefault(event)
  switch (event.inputType) {
    case InputEventType.InsertText:
      RendererWorker.send(/* Editor.type */ 'Editor.type', /* text */ event.data)
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
  RendererWorker.send(/* Editor.compositionStart */ 'Editor.compositionStart', /* text */ event.data)
}

export const handleCompositionUpdate = (event) => {
  RendererWorker.send(/* Editor.compositionUpdate */ 'Editor.compositionUpdate', /* text */ event.data)
}

export const handleCompositionEnd = (event) => {
  RendererWorker.send(/* Editor.compositionEnd */ 'Editor.compositionEnd', /* text */ event.data)
}

export const handleCut = (event) => {
  Event.preventDefault(event)
  RendererWorker.send(/* Editor.cut */ 'Editor.cut')
}

const isRightClick = (event) => {
  return event.button === MouseEventType.RightClick
}

export const handleEditorPointerMove = (event) => {
  const { clientX, clientY, altKey } = event
  if (altKey) {
    RendererWorker.send(/* Editor.moveRectangleSelectionPx */ 'Editor.moveRectangleSelectionPx', /* x */ clientX, /* y */ clientY)
  } else {
    RendererWorker.send(/* Editor.moveSelectionPx */ 'Editor.moveSelectionPx', /* x */ clientX, /* y */ clientY)
  }
}

export const handleEditorLostPointerCapture = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleEditorPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handleEditorLostPointerCapture)
  RendererWorker.send(/* Editor.handlePointerCaptureLost */ 'Editor.handlePointerCaptureLost')
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
  const { clientX, clientY, detail } = event
  const modifier = GetModifierKey.getModifierKey(event)
  RendererWorker.send('Editor.handleMouseDown', /* motifier */ modifier, /* x */ clientX, /* y */ clientY, /* detail */ detail)
}

// TODO figure out whether it is possible to register hover provider without mousemove
// mousemove handler is called very often and could slow down editor / drain battery

/**
 *
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  // event.preventDefault()
  // const state = EditorHelper.getStateFromEvent(event)
  // TODO send editor id
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(/* Editor.setDeltaY */ 'Editor.setDeltaY', /* value */ deltaY)
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(/* Editor.setDeltaY */ 'Editor.setDeltaY', /* value */ deltaY)
      break
    default:
      break
  }
}

export const handlePaste = (event) => {
  Event.preventDefault(event)
  const { clipboardData } = event
  const text = clipboardData.getData(ClipBoardDataType.Text)
  RendererWorker.send(/* Editor.paste */ 'Editor.paste', /* text */ text)
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(/* Editor.handleScrollBarMouseMove */ 'Editor.handleScrollBarMove', /* y */ clientY)
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
  RendererWorker.send(/* EditorHandleScrollBarClick.editorHandleScrollBarPointerDown */ 'Editor.handleScrollBarPointerDown', /* y */ clientY)
}

export const handleScrollBarContextMenu = (event) => {
  Event.preventDefault(event)
  Event.stopPropagation(event)
}

// TODO add touch cancel handler

// TODO use touch events for scrolling

export const handleTouchStart = (event) => {
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  RendererWorker.send(/* EditorHandleTouchStart.editorHandleTouchStart */ 'Editor.handleTouchStart', /* touchEvent */ touchEvent)
}

export const handleTouchMove = (event) => {
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  RendererWorker.send(/* EditorHandleTouchMove.editorHandleTouchMove */ 'Editor.handleTouchMove', /* touchEvent */ touchEvent)
}

export const handleTouchEnd = (event) => {
  if (event.cancelable) {
    Event.preventDefault(event)
  }
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  RendererWorker.send(/* EditorHandleTouchEnd.editorHandleTouchEnd */ 'Editor.handleTouchEnd', /* touchEvent */ touchEvent)
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
  RendererWorker.send(
    /* EditorHandleBeforeInputFromContentEditable.editorHandleBeforeInputFromContentEditable */ 'Editor.handleBeforeInputFromContentEditable',
    /* data */ event.data || '',
    /* range */ range
  )
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
