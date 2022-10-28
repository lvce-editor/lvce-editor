import * as Menu from '../Menu/Menu.js'

export const handleKeyArrowUpMenuOpen = (state) => {
  const { menus } = state
  const menu = menus.at(-1)
  const previousIndex = Menu.getIndexToFocusPrevious(menu)
  const newMenus = [
    ...menus.slice(0, menus.length - 1),
    {
      ...menu,
      focusedIndex: previousIndex,
    },
  ]
  return {
    ...state,
    menus: newMenus,
  }
}
