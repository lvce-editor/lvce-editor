export const expandAll = async (state) => {
  const { dirents, focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = dirents[focusedIndex]
  const depth = dirent.depth
  const newDirents = [...dirents]
  // TODO fetch child dirents in parallel
  for (const dirent of newDirents) {
    if (dirent.depth === depth && dirent.type === 'directory') {
      // TODO expand
      // TODO avoid mutating state here
      dirent.type = 'directory-expanding'
      // TODO handle error
      // TODO race condition
      const childDirents = await getChildDirents(
        state.root,
        state.pathSeparator,
        dirent
      )
      const newIndex = newDirents.indexOf(dirent)
      if (newIndex === -1) {
        continue
      }
      newDirents.splice(newIndex + 1, 0, ...childDirents)
      // TODO avoid mutating state here
      dirent.type = 'directory-expanded'
      // await expand(state, dirent.index)
    }
  }
  return {
    ...state,
    dirents: newDirents,
  }
}
