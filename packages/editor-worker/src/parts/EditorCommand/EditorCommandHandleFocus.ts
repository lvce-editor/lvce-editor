// @ts-ignore
import * as Focus from '../Focus/Focus.ts'
// @ts-ignore
import * as FocusKey from '../FocusKey/FocusKey.ts'

// @ts-ignore
export const handleFocus = (editor) => {
  Focus.setFocus(FocusKey.EditorText)
  return editor
}