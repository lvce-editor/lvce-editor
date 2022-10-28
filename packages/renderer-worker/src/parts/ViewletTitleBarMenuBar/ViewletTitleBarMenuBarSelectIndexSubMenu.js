import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'

export const selectIndexSubMenu = async (state, menu, index) => {
  const { menus } = state
  const { items, top, left, level } = menu
  const item = items[index]
  const subMenuEntries = await MenuEntries.getMenuEntries(item.id)
  const subMenu = {
    level: menus.length,
    items: subMenuEntries,
    focusedIndex: -1,
    top: top + index * 25,
    left: left + Menu.MENU_WIDTH,
  }
  const newParentMenu = {
    ...menu,
    focusedIndex: index,
  }
  const newMenus = [...menus.slice(0, level - 1), newParentMenu, subMenu]
  return {
    ...state,
    menus: newMenus,
  }
}
