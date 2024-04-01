// @ts-ignore
import * as Focus from '../Focus/Focus.js'
// @ts-ignore
import * as FocusKey from '../FocusKey/FocusKey.js'

export const handleFocus = (editor) => {
  Focus.setFocus(FocusKey.EditorText)
  return editor
}
