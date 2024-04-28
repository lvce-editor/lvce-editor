import * as Assert from '../Assert/Assert.ts'
import * as GetDiagnosticDecoration from '../GetDiagnosticDecoration/GetDiagnosticDecoration.js'

export const getDiagnosticDecorations = (editor, diagnostics) => {
  Assert.object(editor)
  Assert.array(diagnostics)
  const decorations = []
  const { minLineY, rowHeight, lines, fontSize, fontFamily, fontWeight, letterSpacing, cursorWidth, tabSize, width, charWidth, isMonospaceFont } =
    editor
  const averageCharWidth = charWidth
  const halfCursorWidth = cursorWidth / 2
  for (const diagnostic of diagnostics) {
    const decoration = GetDiagnosticDecoration.getDiagnosticDecoration(
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
