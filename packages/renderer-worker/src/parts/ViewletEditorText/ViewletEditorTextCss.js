export const Css = ['/css/parts/ViewletEditor.css', '/css/parts/ScrollBar.css']

export const getDynamicCss = (preferences) => {
  const styles = []
  const fontSize = preferences['editor.fontSize']
  if (fontSize) {
    styles.push(`  --EditorFontSize: ${fontSize}px;`)
  }
  const fontFamily = preferences['editor.fontFamily']
  if (fontFamily) {
    styles.push(`  --EditorFontFamily: ${fontFamily};`)
  }
  const lineHeight = preferences['editor.lineHeight']
  if (lineHeight) {
    styles.push(`  --EditorLineHeight: ${lineHeight}px;`)
  }
  const letterSpacing = preferences['editor.letterSpacing']
  if (typeof letterSpacing === 'number') {
    styles.push(`  --EditorLetterSpacing: ${letterSpacing}px;`)
  }
  const fontLigatures = preferences['editor.fontLigatures']
  if (fontLigatures) {
    styles.push(`  --EditorFontFeatureSettings: "liga" 1, "calt" 1;`)
  }
  const tabSize = preferences['editor.tabSize']
  if (tabSize) {
    styles.push(` --EditorTabSize: ${tabSize}`)
  }
  const css = `:root {
${JoinLines.joinLines(styles)}
}`
  return css
}
