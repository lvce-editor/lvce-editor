export const getFocusedDirent = (state) => {
  const dirent = state.dirents[state.focusedIndex]
  return dirent
}
