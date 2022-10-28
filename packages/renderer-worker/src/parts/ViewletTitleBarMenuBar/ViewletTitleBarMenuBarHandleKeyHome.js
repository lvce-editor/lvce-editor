const handleKeyHomeMenuOpen = (state) => {
  const { menus } = state
  const menu = menus[0]
  const newFocusedIndex = Menu.getIndexToFocusFirst(menu.items)
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

const handleKeyHomeMenuClosed = focusFirst

export const handleKeyHome = (state) => {
  return ifElse(state, handleKeyHomeMenuOpen, handleKeyHomeMenuClosed)
}
