// TODO menu should not be needed initially, only when item is selected and menu is opened
import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const state = {
  /**
   * @type{any[]}
   */
  titleBarEntries: [],
  focusedIndex: 0,
  isMenuOpen: false,
}

// TODO put this in json (e.g. defaultTitleBarMenu.json) and load from cache storage or via ajax
// TODO only compute once if is electron and filter out during build process

export const getEntries = async () => {
  state.titleBarEntries = await MenuEntries.getMenuEntries(MenuEntryId.TitleBar)
  return state.titleBarEntries
}

/**
 * @param {number} index
 * @param {boolean} shouldBeFocused
 */
const openMenuAtIndex = async (index, shouldBeFocused) => {
  // TODO race conditions
  // TODO send renderer process
  // 1. open menu, items to show
  // 2. focus menu
  const id = state.titleBarEntries[index].id
  const items = await MenuEntries.getMenuEntries(id)
  Menu.state.menus = []
  const bounds = await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'TitleBar',
    /* method */ 'menuGetEntryBounds',
    /* index */ index
  )
  // TODO race condition: another menu might already be open at this point

  const x = bounds.left
  const y = bounds.bottom
  const width = Menu.getMenuWidth()
  const height = Menu.getMenuHeight(items)
  const menuFocusedIndex = shouldBeFocused
    ? Menu.getIndexToFocusNextStartingAt(items, 0)
    : -1
  const menu = Menu.addMenuInternal({
    id,
    items,
    focusedIndex: menuFocusedIndex,
    level: Menu.state.menus.length,
    x,
    y,
  })
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'TitleBar',
    /* method */ 'menuOpen',
    /* unFocusIndex */ state.focusedIndex,
    /* index */ index,
    /* level */ menu.level,
    /* menuItems */ menu.items,
    /* menuFocusedIndex */ menuFocusedIndex,
    /* focus */ shouldBeFocused,
    /* x */ x,
    /* y */ y,
    /* width */ width,
    /* height */ height
  )
  state.isMenuOpen = true
}

/**
 * @param {boolean} focus
 */
export const openMenu = async (focus) => {
  if (state.focusedIndex === -1) {
    return
  }
  await openMenuAtIndex(state.focusedIndex, focus)
}

export const closeMenu = async (keepFocus) => {
  // TODO send to renderer process
  // 1. close menu
  // 2. focus top level entry
  const focusIndex = keepFocus ? state.focusedIndex : -1
  // TODO use Viewlet.dispose instead
  state.isMenuOpen = false
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'TitleBar',
    /* method */ 'menuClose',
    /* unFocusIndex */ state.focusedIndex,
    /* focusIndex */ focusIndex
  )
}

export const toggleMenu = async () => {
  if (state.isMenuOpen) {
    closeMenu(/* keepFocus */ true)
  } else {
    await openMenu(/* focus */ false)
  }
}

export const focusIndex = async (index) => {
  if (state.isMenuOpen) {
    await openMenuAtIndex(index, /* focus */ false)
  } else {
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBar',
      /* menuFocusIndex */ 'menuFocusIndex',
      /* unFocusIndex */ state.focusedIndex,
      /* index */ index
    )
  }
  state.focusedIndex = index
}

export const toggleIndex = async (index) => {
  if (state.isMenuOpen && state.focusedIndex === index) {
    closeMenu(/* keepFocus */ true)
  } else {
    await openMenuAtIndex(index, /* focus */ false)
  }
  state.focusedIndex = index
}

export const focus = async () => {
  await focusFirst()
}

const getIndexToFocusPreviousStartingAt = (items, index) => {
  return (index + items.length) % items.length
}

export const focusPrevious = async () => {
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    state.titleBarEntries,
    state.focusedIndex - 1
  )
  await focusIndex(indexToFocus)
}

const getIndexToFocusNextStartingAt = (items, index) => {
  return index % items.length
}

export const focusNext = async () => {
  const indexToFocus = getIndexToFocusNextStartingAt(
    state.titleBarEntries,
    state.focusedIndex + 1
  )
  await focusIndex(indexToFocus)
}

export const focusFirst = async () => {
  const indexToFocus = getIndexToFocusNextStartingAt(state.titleBarEntries, 0)
  await focusIndex(indexToFocus)
}

export const focusLast = async () => {
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    state.titleBarEntries,
    state.titleBarEntries.length - 1
  )
  await focusIndex(indexToFocus)
}

export const handleKeyArrowLeft = async () => {
  if (state.isMenuOpen && Menu.state.menus.length > 1) {
    return
  }
  // TODO menu collapse
  await focusPrevious()
}

export const handleKeyArrowUp = () => {
  if (!state.isMenuOpen) {
    return
  }
  Menu.focusPrevious()
}

export const handleKeyArrowRight = async () => {
  console.log('arrow right')
  if (state.isMenuOpen) {
    // if menu can open sub menu to the right -> do that
    const menu = Menu.state.menus.at(-1)
    const item = menu.items[menu.focusedIndex]
    if (item.flags === /* SubMenu */ 4) {
      await Menu.showSubMenu(Menu.state.menus.length - 1, menu.focusedIndex)
      return
    }
  }
  await focusNext()
}

export const handleKeyHome = async () => {
  if (state.isMenuOpen) {
    Menu.focusFirst()
  } else {
    await focusFirst()
  }
}

// TODO this is also use for pagedown -> maybe find a better name for this function
export const handleKeyEnd = async () => {
  if (state.isMenuOpen) {
    Menu.focusLast()
  } else {
    await focusLast()
  }
}

// TODO this is same as handle key enter -> merge the functions
export const handleKeySpace = async () => {
  if (state.isMenuOpen) {
    await Menu.selectCurrent()
  } else {
    openMenu(/* focus */ true)
  }
}

export const handleKeyEnter = async () => {
  if (state.isMenuOpen) {
    await Menu.selectCurrent()
  } else {
    openMenu(/* focus */ true)
  }
}

export const handleKeyEscape = () => {
  if (!state.isMenuOpen) {
    return
  }
  closeMenu(/* keepFocus */ true)
}

export const handleKeyArrowDown = async () => {
  if (state.isMenuOpen) {
    Menu.focusNext()
  } else {
    await openMenu(/* focus */ true)
  }
}
