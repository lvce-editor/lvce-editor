import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'

export const handleFocus = async (state) => {
  Focus.setFocus(FocusKey.SourceControlInput)
  return state
}
