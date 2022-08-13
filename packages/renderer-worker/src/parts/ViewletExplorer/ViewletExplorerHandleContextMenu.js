import * as Command from '../Command/Command.js'

export const handleContextMenu = async (state, x, y, index) => {
  state.focusedIndex = index
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'explorer'
  )
  return state
}
