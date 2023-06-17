import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SupportsLetterSpacing from '../SupportsLetterSpacing/SupportsLetterSpacing.js'
import * as CssVariable from '../CssVariable/CssVariable.js'

export const Css = ['/css/parts/ViewletEditor.css', '/css/parts/ScrollBar.css']

export const getDynamicCss = (preferences) => {
  const styles = []
  const fontSize = preferences['editor.fontSize']
  if (fontSize) {
    styles.push(CssVariable.create('EditorFontSize', fontSize, 'px'))
  }
  const fontFamily = preferences['editor.fontFamily']
  if (fontFamily) {
    styles.push(CssVariable.create('EditorFontFamily', fontFamily))
  }
  const lineHeight = preferences['editor.lineHeight']
  if (lineHeight) {
    styles.push(CssVariable.create('EditorLineHeight', lineHeight, 'px'))
  }
  const letterSpacing = preferences['editor.letterSpacing']
  if (typeof letterSpacing === 'number') {
    if (SupportsLetterSpacing.supportsLetterSpacing()) {
      styles.push(CssVariable.create('EditorLetterSpacing', letterSpacing, 'px'))
    } else {
      styles.push(CssVariable.create('EditorLetterSpacing', 0, 'px'))
    }
  }
  const fontLigatures = preferences['editor.fontLigatures']
  if (fontLigatures) {
    styles.push(CssVariable.create('EditorFontFeatureSettings', '"liga" 1, "calt" 1'))
  }
  const tabSize = preferences['editor.tabSize']
  if (tabSize) {
    styles.push(CssVariable.create('EditorTabSize', tabSize))
  }
  const css = `:root {
${JoinLines.joinLines(styles)}
}`
  return css
}
