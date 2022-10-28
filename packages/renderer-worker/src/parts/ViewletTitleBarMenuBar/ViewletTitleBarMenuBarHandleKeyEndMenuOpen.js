import * as Menu from '../Menu/Menu.js'

export const handleKeyEndMenuOpen = (state) => {
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
