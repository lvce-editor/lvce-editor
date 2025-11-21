import * as CssPxVariable from '../CssPxVariable/CssPxVariable.js'
import * as CssVariable from '../CssVariable/CssVariable.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SupportsLetterSpacing from '../SupportsLetterSpacing/SupportsLetterSpacing.js'

export const Css = [
  '/css/parts/CompletionItem.css',
  '/css/parts/EditorMessage.css',
  '/css/parts/IconButton.css',
  '/css/parts/InputBox.css',
  '/css/parts/MaskIcon.css',
  '/css/parts/MaskIcon.css',
  '/css/parts/Resizer.css',
  '/css/parts/ScrollBar.css',
  '/css/parts/ScrollBarThumb.css',
  '/css/parts/SearchField.css',
  '/css/parts/SearchHeader.css',
  '/css/parts/SearchMessage.css',
  '/css/parts/SearchToggleButton.css',
  '/css/parts/Symbol.css',
  '/css/parts/ViewletColorPicker.css',
  '/css/parts/ViewletEditor.css',
  '/css/parts/ViewletEditorCodeGenerator.css',
  '/css/parts/ViewletEditorCompletion.css',
  '/css/parts/ViewletEditorCompletionDetail.css',
  '/css/parts/ViewletEditorError.css',
  '/css/parts/ViewletEditorHover.css',
  '/css/parts/ViewletEditorRename.css',
  '/css/parts/ViewletEditorSourceActions.css',
  '/css/parts/ViewletFindWidget.css',
  '/css/parts/ViewletList.css',
]

export const getDynamicCss = (preferences) => {
  const styles = []
  const fontSize = preferences['editor.fontSize']
  if (fontSize) {
    styles.push(CssPxVariable.create('EditorFontSize', fontSize))
  }
  const fontWeight = preferences['editor.fontWeight'] ?? 400
  if (fontWeight) {
    styles.push(CssVariable.create('EditorFontWeight', fontWeight))
  }
  const fontFamily = preferences['editor.fontFamily']
  if (fontFamily) {
    styles.push(CssVariable.create('EditorFontFamily', fontFamily))
  }
  const lineHeight = preferences['editor.lineHeight']
  if (lineHeight) {
    styles.push(CssPxVariable.create('EditorLineHeight', lineHeight))
  }
  const letterSpacing = preferences['editor.letterSpacing']
  if (typeof letterSpacing === 'number') {
    if (SupportsLetterSpacing.supportsLetterSpacing()) {
      styles.push(CssPxVariable.create('EditorLetterSpacing', letterSpacing))
    } else {
      styles.push(CssPxVariable.create('EditorLetterSpacing', 0))
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
