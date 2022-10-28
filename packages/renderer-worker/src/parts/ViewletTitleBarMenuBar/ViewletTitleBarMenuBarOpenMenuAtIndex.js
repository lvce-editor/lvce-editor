import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

/**
 * @param {number} index
 * @param {boolean} shouldBeFocused
 */
export const openMenuAtIndex = async (state, index, shouldBeFocused) => {
  const { titleBarEntries } = state
  // TODO race conditions
  // TODO send renderer process
  // 1. open menu, items to show
  // 2. focus menu
  const id = titleBarEntries[index].id
  const items = await MenuEntries.getMenuEntries(id)
  const bounds = await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'TitleBarMenuBar',
    /* method */ 'getMenuEntryBounds',
    /* index */ index
  )
  // TODO race condition: another menu might already be open at this point

  const left = bounds.left
  const top = bounds.bottom
  const width = Menu.getMenuWidth()
  const height = Menu.getMenuHeight(items)
  const menuFocusedIndex = shouldBeFocused
    ? Menu.getIndexToFocusNextStartingAt(items, 0)
    : -1
  const menu = {
    id,
    items,
    focusedIndex: menuFocusedIndex,
    level: 0,
    left,
    top,
    width,
    height,
  }
  const menus = [menu]
  return {
    ...state,
    isMenuOpen: true,
    focusedIndex: index,
    menus,
  }
}
