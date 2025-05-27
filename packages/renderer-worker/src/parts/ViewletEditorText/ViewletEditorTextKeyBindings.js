import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const getKeyBindings = (uid) => {
  // @ts-ignore
  return EditorWorker.invoke('Editor.getKeyBindings', uid)
}
