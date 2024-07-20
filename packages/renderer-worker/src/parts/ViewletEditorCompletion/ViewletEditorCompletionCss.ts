import * as JoinLines from '../JoinLines/JoinLines.js'

export const Css = ['/css/parts/ViewletEditorCompletion.css', '/css/parts/MaskIcon.css', '/css/parts/Symbol.css', '/css/parts/ViewletList.css']

export const getDynamicCss = (preferences: any) => {
  const styles: string[] = []
  const useLayer = preferences['completion.useLayer']
  if (useLayer) {
    styles.push('  will-change: transform;')
  }
  if (styles.length === 0) {
    return ''
  }
  const css = `.EditorCompletion {
${JoinLines.joinLines(styles)}
}`
  return css
}
