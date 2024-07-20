import * as EditorState from '../Editors/Editors.ts'
import * as Assert from '../Assert/Assert.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as EditorScrolling from '../EditorScrolling/EditorScrolling.ts'
import { EditorCreateOptions } from '../EditorCreateOptions/EditorCreateOptions.ts'

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

export const createEditor = ({
  id,
  content,
  savedDeltaY,
  rowHeight,
  fontSize,
  hoverEnabled,
  letterSpacing,
  tabSize,
  links,
  lineNumbers,
  formatOnSave,
  isAutoClosingBracketsEnabled,
  isAutoClosingTagsEnabled,
  isAutoClosingQuotesEnabled,
  isQuickSuggestionsEnabled,
  completionTriggerCharacters,
  savedSelections,
  languageId,
  x,
  y,
  width,
  height,
}: EditorCreateOptions) => {
  Assert.number(id)
  Assert.string(content)
  const lines = SplitLines.splitLines(content)
  const editor = {
    uri: '',
    languageId: '',
    x,
    y,
    width,
    height,
    tokenizerId: 0,
    minLineY: 0,
    maxLineY: 0,
    lines,
    undoStack: [],
    lineCache: [],
    selections: new Uint32Array(),
    diagnostics: [],
    decorations: [],
    primarySelectionIndex: 0,
    deltaX: 0,
    deltaY: 0,
    numberOfVisiblelines: 0,
    finalY: 0,
    finalDeltaY: 0,
    columnWidth: 0,
    rowHeight,
    scrollBarWidth: 0,
    scrollBarHeight: 0,
    validLines: [],
    invalidStartIndex: 0,
    focused: false,
    handleOffsetX: 0,
    itemHeight: 20,
    fontFamily: '',
    fontWeight: 400,
    tabSize: 2,
    cursorWidth: 2,
    completionState: '',
    longestLineWidth: 0,
    minimumSliderSize: 20,
    differences: [],
    completionUid: 0,
    lineNumbers,
  }
  const newEditor = EditorScrolling.setDeltaY(editor, 0)
  console.log({ newEditor })
  EditorState.set(id, emptyEditor, newEditor)
}
