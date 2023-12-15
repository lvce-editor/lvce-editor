import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'

export const handleFocus = (state) => {
  Focus.setFocus(FocusKey.TitleBarMenuBar)
  return state
}
