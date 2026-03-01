import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const wrapEditorCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await EditorWorker.invoke(`Editor.${key}`, state.uid, ...args)
    const diffResult = await EditorWorker.invoke('Editor.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await EditorWorker.invoke('Editor.render2', state.uid, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
