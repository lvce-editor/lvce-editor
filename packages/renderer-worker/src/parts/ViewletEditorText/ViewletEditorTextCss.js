import * as CssPxVariable from '../CssPxVariable/CssPxVariable.js'
import * as CssVariable from '../CssVariable/CssVariable.js'
import * as EditorPreferences from '../EditorPreferences/EditorPreferences.js'
import * as JoinLines from '../JoinLines/JoinLines.js'

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
  const fontSize = EditorPreferences.getFontSize(preferences)
  styles.push(CssPxVariable.create('EditorFontSize', fontSize))
  const fontWeight = EditorPreferences.getFontWeight(preferences)
  styles.push(CssVariable.create('EditorFontWeight', fontWeight))
  const fontFamily = EditorPreferences.getFontFamily(preferences)
  styles.push(CssVariable.create('EditorFontFamily', fontFamily))
  const lineHeight = EditorPreferences.getRowHeight(preferences)
  styles.push(CssPxVariable.create('EditorLineHeight', lineHeight))
  const letterSpacing = EditorPreferences.getLetterSpacing(preferences)
  styles.push(CssPxVariable.create('EditorLetterSpacing', letterSpacing))
  const fontLigatures = preferences['editor.fontLigatures']
  if (fontLigatures) {
    styles.push(CssVariable.create('EditorFontFeatureSettings', '"liga" 1, "calt" 1'))
  }
  const tabSize = EditorPreferences.getTabSize(preferences)
  styles.push(CssVariable.create('EditorTabSize', tabSize))
  const blockCursor = preferences['editor.cursorStyle'] === 'block'
  styles.push(CssVariable.create('EditorCursorWidth', blockCursor ? '1ch' : '2px'))
  styles.push(CssVariable.create('EditorCursorOpacity', blockCursor ? '0.5' : '1'))
  const css = `:root {
${JoinLines.joinLines(styles)}
}`
  return css
}
