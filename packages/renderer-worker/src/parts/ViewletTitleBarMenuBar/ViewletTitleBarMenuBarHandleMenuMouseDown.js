import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import { selectIndexIgnore } from './ViewletTitleBarMenuBarSelectIndexIgnore.js'
import { selectIndexNone } from './ViewletTitleBarMenuBarSelectIndexNone.js'
import { selectIndexRestoreFocus } from './ViewletTitleBarMenuBarSelectIndexRestoreFocus.js'
import { selectIndexSubMenu } from './ViewletTitleBarMenuBarSelectIndexSubMenu.js'

export const handleMenuMouseDown = (state, level, index) => {
  const { menus } = state
  const menu = menus[level]
  const item = menu.items[index]
  switch (item.flags) {
    case MenuItemFlags.None:
      return selectIndexNone(state, item)
    case MenuItemFlags.SubMenu:
      return selectIndexSubMenu(state, menu, index)
    case MenuItemFlags.RestoreFocus:
      return selectIndexRestoreFocus(state, item)
    case MenuItemFlags.Ignore:
      selectIndexIgnore(state, item)
    default:
      return state
  }
}
