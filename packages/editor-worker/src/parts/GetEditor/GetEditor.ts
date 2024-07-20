import * as Editors from '../Editors/Editors.ts'

export const getEditor = (editorUid: number) => {
  const instance = Editors.get(editorUid)
  if (!instance) {
    throw new Error(`editor ${editorUid} not found`)
  }
  const { newState } = instance
  return newState
}
