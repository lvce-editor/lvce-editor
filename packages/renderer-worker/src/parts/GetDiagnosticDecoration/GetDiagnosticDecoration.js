import * as GetX from '../GetX/GetX.js'

export const getDiagnosticDecoration = (
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
