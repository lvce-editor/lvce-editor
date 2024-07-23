import * as Assert from '../Assert/Assert.ts'
import * as GetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'
import * as Editors from '../Editors/Editors.ts'
import * as Hover from '../Hover/Hover.ts'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.ts'

const getHoverPosition = (position: any, selections: any) => {
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

const getMatchingDiagnostics = (diagnostics: any, rowIndex: number, columnIndex: number) => {
  const matching: any[] = []
  for (const diagnostic of diagnostics) {
    if (diagnostic.rowIndex === rowIndex) {
      matching.push(diagnostic)
    }
  }
  return matching
}

const fallbackDisplayStringLanguageId = 'typescript' // TODO remove this

const hoverDocumentationFontSize = 15
const hoverDocumentationFontFamily = 'Fira Code'
const hoverDocumentationLineHeight = '1.33333'
const hoverBorderLeft = 1
const hoverBorderRight = 1
const hoverPaddingLeft = 8
const hoverPaddingRight = 8
const hovverFullWidth = 400
const hoverDocumentationWidth = hovverFullWidth - hoverPaddingLeft - hoverPaddingRight - hoverBorderLeft - hoverBorderRight

const getHoverPositionXy = (editor: any, rowIndex: number, wordStart: any, documentationHeight: any) => {
  const x = EditorPosition.x(editor, rowIndex, wordStart)
  const y = editor.height - EditorPosition.y(editor, rowIndex) + editor.y + 40
  return {
    x,
    y,
  }
}

export const getEditorHoverInfo = async (editorUid: number, position: any) => {
  Assert.number(editorUid)
  const instance = Editors.get(editorUid)
  const editor = instance.newState
  const { selections } = editor
  const { rowIndex, columnIndex } = getHoverPosition(position, selections)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await Hover.getHover(editor, offset)
  if (!hover) {
    return undefined
  }
  const { displayString, documentation, displayStringLanguageId } = hover
  const tokenizerPath = ''
  const lineInfos = await TokenizeCodeBlock.tokenizeCodeBlock(
    displayString,
    displayStringLanguageId || fallbackDisplayStringLanguageId,
    tokenizerPath,
  )
  const wordPart = await GetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  const wordStart = columnIndex - wordPart.length
  const documentationHeight = await MeasureTextHeight.measureTextBlockHeight(
    documentation,
    hoverDocumentationFontFamily,
    hoverDocumentationFontSize,
    hoverDocumentationLineHeight,
    hoverDocumentationWidth,
  )
  const { x, y } = getHoverPositionXy(editor, rowIndex, wordStart, documentationHeight)
  const diagnostics = editor.diagnostics || []
  const matchingDiagnostics = getMatchingDiagnostics(diagnostics, rowIndex, columnIndex)
  return {
    lineInfos,
    documentation,
    x,
    y,
    matchingDiagnostics,
  }
}
