import * as EditorState from '../Editors/Editors.ts'

export const createEditor = (id: number) => {
  const editor = {}
  EditorState.set(id, editor)
}
