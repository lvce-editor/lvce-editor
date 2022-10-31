export const closeEditor = async (state, index) => {
  const { editors, activeIndex } = state
  if (editors.length === 1) {
    return closeAllEditors(state)
  }
  const top = state.top
  const left = state.left
  const width = state.width
  const height = state.height
  if (index === activeIndex) {
    const oldActiveIndex = state.activeIndex
    const oldEditor = state.editors[index]
    const newActiveIndex = index === 0 ? index : index - 1
    const id = ViewletMap.getId(oldEditor.uri)
    Viewlet.dispose(id)
    const newEditors = Arrays.removeIndex(editors, index)
    return {
      ...state,
      editors: newEditors,
      selectedIndex: newActiveIndex,
      focusedIndex: newActiveIndex,
    }
  }
  const newEditors = Arrays.removeIndex(editors, index)
  return {
    ...state,
    editors: newEditors,
  }
}
