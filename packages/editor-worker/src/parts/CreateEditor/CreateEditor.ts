import * as EditorState from '../Editors/Editors.ts'

export const createEditor = (id: number, content: string) => {
  console.log({ content })
  const editor = {
    content,
  }
  EditorState.set(id, editor)
}
