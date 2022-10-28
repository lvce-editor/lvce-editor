import { focusNext } from './ViewletTitleBarMenuBarFocusNext.js'
// TODO menu should not be needed initially, only when item is selected and menu is opened
import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const handleKeyArrowRightMenuOpen = async (state) => {
  const { menus } = state
  // if menu can open sub menu to the right -> do that
  const menu = menus.at(-1)
  const { items, focusedIndex, left, top } = menu
  if (focusedIndex === -1) {
    return focusNext(state)
  }
  const item = items[focusedIndex]
  if (item.flags === MenuItemFlags.SubMenu) {
    const subMenuEntries = await MenuEntries.getMenuEntries(item.id)
    const subMenu = {
      level: menus.length,
      items: subMenuEntries,
      focusedIndex: 0,
      top: top + focusedIndex * 25,
      left: left + Menu.MENU_WIDTH,
    }
    const newParentMenu = {
      ...menu,
      expanded: true,
    }
    const newMenus = [...menus.slice(0, -1), newParentMenu, subMenu]
    return {
      ...state,
      menus: newMenus,
    }
  }
  return focusNext(state)
}
