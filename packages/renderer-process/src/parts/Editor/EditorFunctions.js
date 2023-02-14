import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleContextMenu = (x, y) => {
  // TODO this should go to editor module first, which then calls context menu module
  RendererWorker.send('ContextMenu.show', x, y, MenuEntryId.Editor)
}

export const handleBlur = () => {
  RendererWorker.send('Editor.blur')
}

export const type = (text) => {
  RendererWorker.send('Editor.type', text)
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

export const setDeltaY = (deltaY) => {
  RendererWorker.send('Editor.setDeltaY', deltaY)
}

export const paste = (text) => {
  RendererWorker.send('Editor.paste', text)
}

export const handleScrollBarMove = (y) => {
  RendererWorker.send('Editor.handleScrollBarMove', y)
}

export const handleScrollBarPointerDown = (y) => {
  RendererWorker.send('Editor.handleScrollBarPointerDown', y)
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
