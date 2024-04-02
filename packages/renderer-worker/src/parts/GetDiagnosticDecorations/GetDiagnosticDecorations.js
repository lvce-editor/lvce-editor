import * as Assert from '../Assert/Assert.ts'
import * as GetX from '../GetX/GetX.js'

const getDiagnosticDecoration = (
  lines,
  minLineY,
  rowHeight,
  fontWeight,
  fontSize,
  fontFamily,
  isMonospaceFont,
  letterSpacing,
  tabSize,
  halfCursorWidth,
  width,
  averageCharWidth,
  diagnostic,
) => {
  const { rowIndex, columnIndex, endRowIndex, endColumnIndex } = diagnostic
  const y = GetX.getY(rowIndex, minLineY, rowHeight)
  const line = lines[rowIndex]
  const startX = GetX.getX(
    line,
    columnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
  )
  const endX = GetX.getX(
    line,
    endColumnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
  )
  const decorationWidth = endX - startX
  return {
    x: startX,
    y,
    width: decorationWidth,
    height: rowHeight,
  }
}

export const getDiagnosticDecorations = (editor, diagnostics) => {
  Assert.object(editor)
  Assert.array(diagnostics)
  const decorations = []
  const { minLineY, rowHeight, lines, fontSize, fontFamily, fontWeight, letterSpacing, cursorWidth, tabSize, width, charWidth, isMonospaceFont } =
    editor
  const averageCharWidth = charWidth
  const halfCursorWidth = cursorWidth / 2
  for (const diagnostic of diagnostics) {
    const decoration = getDiagnosticDecoration(
      lines,
      minLineY,
      rowHeight,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      diagnostic,
    )
    decorations.push(decoration)
  }
  return decorations
}
