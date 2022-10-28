import * as Menu from '../Menu/Menu.js'

export const handleKeyHomeMenuOpen = (state) => {
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
