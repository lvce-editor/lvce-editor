import * as EditorState from '../Editors/Editors.ts'
import * as Assert from '../Assert/Assert.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

export const createEditor = (id: number, content: string) => {
  Assert.number(id)
  Assert.string(content)
  const lines = SplitLines.splitLines(content)
  const editor = {
    lines,
  }
  EditorState.set(id, editor)
}
