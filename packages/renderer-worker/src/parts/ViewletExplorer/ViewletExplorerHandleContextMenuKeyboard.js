import * as Command from '../Command/Command.js'

export const handleContextMenuKeyboard = async (state) => {
  const { focusedIndex, left, top, minLineY, itemHeight } = state
  const x = left
  const y = top + (focusedIndex - minLineY + 1) * itemHeight
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'explorer'
  )
  return state
}
