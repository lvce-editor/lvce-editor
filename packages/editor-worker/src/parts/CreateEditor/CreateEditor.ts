import * as EditorState from '../Editors/Editors.ts'
import * as Assert from '../Assert/Assert.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const emptyEditor = {
  uri: '',
  languageId: '', // TODO use numeric language id?
  lines: [],
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  tokenizerId: 0,
  minLineY: 0,
  decorations: [],
  embeds: [],
  deltaX: 0,
  focused: false,
  deltaY: 0,
  scrollBarHeight: 0,
  longestLineWidth: 0,
  maxLineY: 0,
  undoStack: [],
  lineCache: [],
  selections: new Uint32Array(),
  diagnostics: [],
}

export const createEditor = (id: number, content: string) => {
  Assert.number(id)
  Assert.string(content)
  const lines = SplitLines.splitLines(content)
  const editor = {
    uri: '',
    languageId: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    tokenizerId: 0,
    minLineY: 0,
    maxLineY: 0,
    lines,
    undoStack: [],
    lineCache: [],
    selections: new Uint32Array(),
    diagnostics: [],
  }
  EditorState.set(id, emptyEditor, editor)
}
