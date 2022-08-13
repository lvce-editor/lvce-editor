const handleClickDirectory = async (state, dirent, index) => {
  dirent.type = 'directory-expanding'
  // TODO handle error
  const dirents = await getChildDirents(state.root, state.pathSeparator, dirent)
  const state2 = Viewlet.getState('Explorer')
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.dirents.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  // console.log(state.dirents[index] === dirent)
  const newDirents = [...state2.dirents]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  dirent.type = 'directory-expanded'
  dirent.icon = IconTheme.getIcon(dirent)
  // TODO when focused index has changed while expanding, don't update it
  return {
    ...state,
    dirents: newDirents,
    focusedIndex: newIndex,
  }
}
