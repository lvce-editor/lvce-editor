import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as Hover from '../Hover/Hover.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    id,
    x: 0,
    y: 0,
    width: 250,
    height: 150,
    maxHeight: 150,
    sanitzedHtml: '',
    documentation: '',
    lineInfos: [],
    diagnostics: [],
  }
}

const getHoverPosition = (position, selections) => {
  if (position) {
    return position
  }
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  return {
    rowIndex,
    columnIndex,
  }
}

const getMatchingDiagnostics = (diagnostics, rowIndex, columnIndex) => {
  const matching = []
  for (const diagnostic of diagnostics) {
    if (diagnostic.rowIndex === rowIndex) {
      matching.push(diagnostic)
    }
  }
  return matching
}

const fallbackDisplayStringLanguageId = 'typescript' // TODO remove this

export const loadContent = async (state, savedState, position) => {
  const editor = GetActiveEditor.getActiveEditor()
  const { selections, height, lines } = editor
  const { rowIndex, columnIndex } = getHoverPosition(position, selections)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await Hover.getHover(editor, offset)
  if (!hover) {
    return state
  }
  const { displayString, documentation, displayStringLanguageId } = hover
  const lineInfos = await TokenizeCodeBlock.tokenizeCodeBlock(displayString, displayStringLanguageId || fallbackDisplayStringLanguageId)
  const wordPart = EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  const wordStart = columnIndex - wordPart.length
  const x = EditorPosition.x(editor, rowIndex, wordStart)
  const y = height - EditorPosition.y(editor, rowIndex) + editor.y + 40
  const diagnostics = editor.diagnostics || []
  const matchingDiagnostics = getMatchingDiagnostics(diagnostics, rowIndex, columnIndex)
  return {
    ...state,
    lineInfos,
    documentation,
    x,
    y,
    diagnostics: matchingDiagnostics,
  }
}
