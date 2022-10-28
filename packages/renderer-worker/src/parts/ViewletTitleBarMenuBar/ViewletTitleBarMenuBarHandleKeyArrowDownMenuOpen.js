export const handleKeyArrowDownMenuOpen = (state) => {
  const { menus } = state
  const menu = menus.at(-1)
  const newFocusedIndex = Menu.getIndexToFocusNext(menu)
  const newMenus = [
    ...menus.slice(0, -1),
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
