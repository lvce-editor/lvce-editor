import { handleClick } from './ViewletExtensionsHandleClick.js'

export const handleClickCurrent = (state) => {
  const { focusedIndex } = state
  return handleClick(state, focusedIndex)
}
