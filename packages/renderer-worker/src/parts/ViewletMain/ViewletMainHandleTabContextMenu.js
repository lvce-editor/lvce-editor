export const handleTabContextMenu = async (state, index, x, y) => {
  state.focusedIndex = index
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Tab
  )
}
