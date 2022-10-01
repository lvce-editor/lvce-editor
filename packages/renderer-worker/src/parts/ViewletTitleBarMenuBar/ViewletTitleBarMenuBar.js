// TODO menu should not be needed initially, only when item is selected and menu is opened
import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TitleBarMenuBarEntries from '../TitleBarMenuBarEntries/TitleBarMenuBarEntries.js'

export const name = 'TitleBarMenuBar'

export const create = () => {
  return {
    titleBarEntries: [],
    focusedIndex: -1,
    isMenuOpen: false,
    menus: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBarEntries.getEntries()
  return {
    ...state,
    titleBarEntries,
  }
}

/**
 * @param {number} index
 * @param {boolean} shouldBeFocused
 */
const openMenuAtIndex = async (state, index, shouldBeFocused) => {
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
  console.log({ shouldBeFocused })
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

/**
 * @param {boolean} focus
 */
export const openMenu = (state, focus) => {
  const { focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  console.log({ focus })
  return openMenuAtIndex(state, focusedIndex, focus)
}

export const closeMenu = (state, keepFocus) => {
  // TODO send to renderer process
  // 1. close menu
  // 2. focus top level entry
  const focusIndex = keepFocus ? state.focusedIndex : -1
  return {
    ...state,
    menus: [],
    isMenuOpen: false,
    focusIndex,
  }
}

export const toggleMenu = (state) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return closeMenu(state, /* keepFocus */ true)
  }
  return openMenu(state, /* focus */ false)
}

export const focusIndex = async (state, index) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return openMenuAtIndex(state, index, /* focus */ false)
  }
  return {
    ...state,
    focusedIndex: index,
  }
}

export const toggleIndex = async (state, index) => {
  const { isMenuOpen, focusedIndex } = state
  if (isMenuOpen && focusedIndex === index) {
    return closeMenu(state, /* keepFocus */ true)
  }
  return openMenuAtIndex(state, index, /* focus */ false)
}

export const focus = (state) => {
  return focusFirst(state)
}

const getIndexToFocusPreviousStartingAt = (items, index) => {
  return (index + items.length) % items.length
}

export const focusPrevious = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    titleBarEntries,
    focusedIndex - 1
  )
  return focusIndex(state, indexToFocus)
}

const getIndexToFocusNextStartingAt = (items, index) => {
  return index % items.length
}

export const focusNext = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = getIndexToFocusNextStartingAt(
    titleBarEntries,
    focusedIndex + 1
  )
  return focusIndex(state, indexToFocus)
}

export const focusFirst = (state) => {
  const { titleBarEntries } = state
  const indexToFocus = getIndexToFocusNextStartingAt(titleBarEntries, 0)
  return focusIndex(state, indexToFocus)
}

export const focusLast = (state) => {
  const { titleBarEntries } = state
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    titleBarEntries,
    titleBarEntries.length - 1
  )
  return focusIndex(indexToFocus)
}

export const handleKeyArrowLeft = (state) => {
  const { isMenuOpen, menus } = state
  if (isMenuOpen && menus.length > 1) {
    return state
  }
  // TODO menu collapse
  return focusPrevious(state)
}

export const handleKeyArrowUp = (state) => {
  const { isMenuOpen } = state
  if (!isMenuOpen) {
    return state
  }
  // TODO
  // Menu.focusPrevious()
  return state
}

export const handleKeyArrowRight = (state) => {
  const { isMenuOpen, menus } = state
  console.log('arrow right')
  if (isMenuOpen) {
    // if menu can open sub menu to the right -> do that
    const menu = menus.at(-1)
    const item = menu.items[menu.focusedIndex]
    if (item.flags === MenuItemFlags.SubMenu) {
      // TODO show sub menu
      // await Menu.showSubMenu(Menu.state.menus.length - 1, menu.focusedIndex)
      return state
    }
  }
  return focusNext(state)
}

export const handleKeyHome = (state) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    // TODO
    // Menu.focusFirst()
    return state
  }
  return focusFirst(state)
}

// TODO this is also use for pagedown -> maybe find a better name for this function
export const handleKeyEnd = (state) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    // TODO
    // Menu.focusLast()
    return state
  }
  return focusLast(state)
}

// TODO this is same as handle key enter -> merge the functions
export const handleKeySpace = (state) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    // TODO
    // await Menu.selectCurrent()
    return state
  }
  return openMenu(state, /* focus */ true)
}

export const handleKeyEnter = (state) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    // TODO
    // await Menu.selectCurrent()
    return state
  }
  return openMenu(state, /* focus */ true)
}

export const handleKeyEscape = (state) => {
  const { isMenuOpen } = state
  if (!isMenuOpen) {
    return state
  }
  return closeMenu(state, /* keepFocus */ true)
}

export const handleKeyArrowDown = async (state) => {
  const { isMenuOpen } = state
  console.log('title bar arrow down', { isMenuOpen })
  if (isMenuOpen) {
    // TODO
    // Menu.focusNext()
    return state
  }
  console.log('arrow down', 'focus true')
  return openMenu(state, /* focus */ true)
}

export const hasFunctionalRender = true

const renderTitleBarEntries = {
  isEqual(oldState, newState) {
    return oldState.titleBarEntries === newState.titleBarEntries
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBarMenuBar',
      /* method */ 'setEntries',
      /* titleBarEntries */ newState.titleBarEntries,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBarMenuBar',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex,
      /* newfocusedIndex */ newState.focusedIndex,
    ]
  },
}

const renderMenus = {
  isEqual(oldState, newState) {
    console.log({ oldState, newState })
    return oldState.menus === newState.menus
  },
  apply(oldState, newState) {
    console.log('send menus')
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBarMenuBar',
      /* method */ 'setMenus',
      /* menus */ newState.menus,
    ]
  },
}

export const render = [renderTitleBarEntries, renderFocusedIndex, renderMenus]
