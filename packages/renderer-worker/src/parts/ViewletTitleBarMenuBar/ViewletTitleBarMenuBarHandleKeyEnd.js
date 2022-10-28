const handleKeyEndMenuOpen = (state) => {
  const { menus } = state
  const menu = menus[0]
  const newFocusedIndex = Menu.getIndexToFocusLast(menu.items)
  const newMenus = [
    {
      ...menu,
      focusedIndex: newFocusedIndex,
    },
  ]
  return {
    ...state,
    menus: newMenus,
  }
}

const handleKeyEndMenuClosed = focusLast

// TODO this is also use for pagedown -> maybe find a better name for this function
export const handleKeyEnd = (state) => {
  return ifElse(state, handleKeyEndMenuOpen, handleKeyEndMenuClosed)
}
