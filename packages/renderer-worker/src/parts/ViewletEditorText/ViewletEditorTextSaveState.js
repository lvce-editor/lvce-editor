import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const getStorageKey = (state) => {
  return `Editor:${state.uri}`
}

export const saveState = async (state) => {
  // @ts-ignore
  const { selections, focused, deltaY, id } = state
  const editorState = await EditorWorker.invoke('Editor.saveState', id)
  return {
    selections: Array.from(selections),
    focused,
    deltaY,
    editorState,
  }
}
