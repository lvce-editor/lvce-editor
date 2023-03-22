import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleContextMenu = (button, x, y) => {
  RendererWorker.send('Editor.handleContextMenu', button, x, y, MenuEntryId.Editor)
}

export const handleBlur = () => {
  RendererWorker.send('Editor.blur')
}

export const type = (text) => {
  RendererWorker.send('Editor.type', text)
}

export const typeWithAutoClosing = (text) => {
  RendererWorker.send('Editor.typeWithAutoClosing', text)
}

export const compositionStart = (data) => {
  RendererWorker.send('Editor.compositionStart', data)
}

export const compositionUpdate = (data) => {
  RendererWorker.send('Editor.compositionUpdate', data)
}

export const compositionEnd = (data) => {
  RendererWorker.send('Editor.compositionEnd', data)
}

export const cut = () => {
  RendererWorker.send('Editor.cut')
}

export const moveRectangleSelectionPx = (x, y) => {
  RendererWorker.send('Editor.moveRectangleSelectionPx', x, y)
}

export const moveSelectionPx = (x, y) => {
  RendererWorker.send('Editor.moveSelectionPx', x, y)
}

export const handlePointerCaptureLost = () => {
  RendererWorker.send('Editor.handlePointerCaptureLost')
}

export const handleMouseDown = (modifier, x, y, detail) => {
  RendererWorker.send('Editor.handleMouseDown', modifier, x, y, detail)
}

export const setDelta = (deltaMode, deltaX, deltaY) => {
  RendererWorker.send('Editor.setDelta', deltaMode, deltaX, deltaY)
}

export const paste = (text) => {
  RendererWorker.send('Editor.paste', text)
}

export const handleScrollBarVerticalMove = (y) => {
  RendererWorker.send('Editor.handleScrollBarMove', y)
}

export const handleScrollBarVerticalPointerDown = (y) => {
  RendererWorker.send('Editor.handleScrollBarPointerDown', y)
}

export const handleScrollBarHorizontalMove = (x) => {
  RendererWorker.send('Editor.handleScrollBarHorizontalMove', x)
}

export const handleScrollBarHorizontalPointerDown = (x) => {
  RendererWorker.send('Editor.handleScrollBarHorizontalPointerDown', x)
}

export const handleTouchStart = (touchEvent) => {
  RendererWorker.send('Editor.handleTouchStart', touchEvent)
}

export const handleTouchMove = (touchEvent) => {
  RendererWorker.send('Editor.handleTouchMove', touchEvent)
}

export const handleTouchEnd = (touchEvent) => {
  RendererWorker.send('Editor.handleTouchEnd', touchEvent)
}

export const handleBeforeInputFromContentEditable = (data, range) => {
  RendererWorker.send('Editor.handleBeforeInputFromContentEditable', data, range)
}
