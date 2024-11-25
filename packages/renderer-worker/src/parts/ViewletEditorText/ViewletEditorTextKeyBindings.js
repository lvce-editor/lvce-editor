import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const getKeyBindings = () => {
  // @ts-ignore
  return EditorWorker.invoke('Editor.getKeyBindings')
}
