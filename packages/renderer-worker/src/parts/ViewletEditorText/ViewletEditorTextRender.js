import * as Editor from '../Editor/Editor.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import { rerender } from './ViewletEditorText.js'

export const hasFunctionalResize = true

export const resize = async (state, dimensions) => {
  await EditorWorker.invoke('Editor.resize', state.id, dimensions)
  const newState = Editor.setBounds(state, dimensions.x, dimensions.y, dimensions.width, dimensions.height, state.columnWidth)
  const resizedState = await rerender(newState)
  return {
    ...resizedState,
    // A pending resize can precede the initial root render. Keep its commands.
    commands: [...(state.commands || []), ...resizedState.commands],
  }
}

export const hasFunctionalRender = true
export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true
export const hasDirectRender = true

export const render = Editor.render

export const renderEventListeners = async () => {
  const listeners = await EditorWorker.invoke('Editor.renderEventListeners')
  // Avoid a native blur overtaking the asynchronously rendered pointer focus.
  return listeners.map((listener) => (listener.params?.[0] === 'handleMouseDown' ? { ...listener, preventDefault: true } : listener))
}
