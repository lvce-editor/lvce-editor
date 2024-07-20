import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as Hover from '../Hover/Hover.js'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as TokenizeCodeBlock from '../TokenizeCodeBlock/TokenizeCodeBlock.js'
import * as EditorTextCommands from '../ViewletEditorText/ViewletEditorTextCommands.js'

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

const getHoverPositionXy = (editor, rowIndex, wordStart, documentationHeight) => {
  const x = EditorPosition.x(editor, rowIndex, wordStart)
  const y = editor.height - EditorPosition.y(editor, rowIndex) + editor.y + 40
  return {
    x,
    y,
  }
}

export const getEditorHoverInfo = async (editor: any, position: any) => {
  // @ts-ignore
  const { selections, height, lines } = editor
  const { rowIndex, columnIndex } = getHoverPosition(position, selections)
  const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await Hover.getHover(editor, offset)
  if (!hover) {
    return undefined
  }
  const { displayString, documentation, displayStringLanguageId } = hover
  const lineInfos = await TokenizeCodeBlock.tokenizeCodeBlock(displayString, displayStringLanguageId || fallbackDisplayStringLanguageId)
  // @ts-ignore
  const wordPart = await EditorTextCommands.Commands.getWordBefore(editor, rowIndex, columnIndex)
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
