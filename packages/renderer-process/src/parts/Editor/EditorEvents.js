// TODO so many things in this file

import * as Focus from '../Focus/Focus.js'
import * as InputEventType from '../InputEventType/InputEventType.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ModifierKey from '../ModifierKey/ModifierKey.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
// TODO go back to edit mode after pressing escape so screenreaders can navigate https://stackoverflow.com/questions/53909477/how-to-handle-tabbing-for-accessibility-with-a-textarea-that-uses-the-tab-button

// TODO tree shake out mobile support when targeting electron -> less code -> less event listeners -> less memory -> less cpu

export const handleContextMenu = (event) => {
  event.preventDefault()
  const { clientX, clientY } = event
  RendererWorker.send(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ clientX,
    /* y */ clientY,
    /* id */ MenuEntryId.Editor
  )
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

export const handleCompositionStart = (event) => {
  RendererWorker.send(
    /* Editor.compositionStart */ 'Editor.compositionStart',
    /* text */ event.data
  )
}

export const handleCompositionUpdate = (event) => {
  RendererWorker.send(
    /* Editor.compositionUpdate */ 'Editor.compositionUpdate',
    /* text */ event.data
  )
}

export const handleCompositionEnd = (event) => {
  RendererWorker.send(
    /* Editor.compositionEnd */ 'Editor.compositionEnd',
    /* text */ event.data
  )
}

export const handleCut = (event) => {
  event.preventDefault()
  RendererWorker.send(/* Editor.cut */ 'Editor.cut')
}

export const handleSelectionMove = (event) => {
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

export const handleSelectionDone = (event) => {
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

export const handleSingleClick = (event, x, y, offset) => {
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

export const handleDoubleClick = (event, x, y, offset) => {
  RendererWorker.send(
    /* Editor.handleDoubleClick */ 'Editor.handleDoubleClick',
    /* x */ x,
    /* y */ y,
    /* offset */ offset
  )
}

export const handleTripleClick = (event, x, y, offset) => {
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

export const handleMouseDown = (event) => {
  if (isRightClick(event)) {
    return
  }
  event.preventDefault()
  const totalOffset = getTotalOffset(event)
  const x = event.clientX
  const y = event.clientY
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
export const handlePointerMove = (event) => {
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
  // RendererWorker.send(/* Editor.handleMouseMove */ 389, /* x */ x, /* y */ y)
}

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
      RendererWorker.send(
        /* Editor.setDeltaY */ 'Editor.setDeltaY',
        /* value */ deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* Editor.setDeltaY */ 'Editor.setDeltaY',
        /* value */ deltaY
      )
      break
    default:
      break
  }
}

export const handlePaste = (event) => {
  event.preventDefault()
  const text = event.clipboardData.getData('text')
  RendererWorker.send(/* Editor.paste */ 'Editor.paste', /* text */ text)
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(
    /* Editor.handleScrollBarMouseMove */ 'Editor.handleScrollBarMove',
    /* y */ clientY
  )
}

export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener('pointermove', handleScrollBarThumbPointerMove)
  target.removeEventListener('pointerup', handleScrollBarPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener('pointermove', handleScrollBarThumbPointerMove, {
    passive: false,
  })
  target.addEventListener('pointerup', handleScrollBarPointerUp)
  RendererWorker.send(
    /* EditorHandleScrollBarClick.editorHandleScrollBarPointerDown */ 'Editor.handleScrollBarPointerDown',
    /* y */ clientY
  )
}

export const handleScrollBarContextMenu = (event) => {
  event.preventDefault()
  event.stopPropagation()
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

export const handleTouchStart = (event) => {
  const touchEvent = toSimpleTouchEvent(event)
  RendererWorker.send(
    /* EditorHandleTouchStart.editorHandleTouchStart */ 'Editor.handleTouchStart',
    /* touchEvent */ touchEvent
  )
}

export const handleTouchMove = (event) => {
  const touchEvent = toSimpleTouchEvent(event)
  RendererWorker.send(
    /* EditorHandleTouchMove.editorHandleTouchMove */ 'Editor.handleTouchMove',
    /* touchEvent */ touchEvent
  )
}

export const handleTouchEnd = (event) => {
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
