import { handleClick } from './ViewletExtensionsHandleClick.js'

export const handleClickCurrentButKeepFocus = (state) => {
  const { focusedIndex } = state
  return handleClick(state, focusedIndex)
}
