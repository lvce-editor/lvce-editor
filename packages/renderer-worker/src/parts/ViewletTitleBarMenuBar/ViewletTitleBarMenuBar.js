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

const identity = (state) => {
  return state
}

/**
 * @param {boolean} focus
 */
export const openMenu = (state, focus) => {
  const { focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  return openMenuAtIndex(state, focusedIndex, focus)
}

export const closeMenu = (state, keepFocus) => {
  const { focusedIndex } = state
  // TODO send to renderer process
  // 1. close menu
  // 2. focus top level entry
  const newFocusedIndex = keepFocus ? focusedIndex : -1
  return {
    ...state,
    menus: [],
    isMenuOpen: false,
    focusedIndex: newFocusedIndex,
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
  return focusIndex(state, indexToFocus)
}

const handleKeyArrowLeftMenuOpen = (state) => {
  const { menus } = state
  if (menus.length > 1) {
    // TODO menu collapse
    return state
  }
  return focusPrevious(state)
}

const handleKeyArrowLeftMenuClosed = (state) => {
  // TODO menu collapse
  return focusPrevious(state)
}

const ifElse = (state, menuOpenFunction, menuClosedFunction) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return menuOpenFunction(state)
  }
  return menuClosedFunction(state)
}

export const handleKeyArrowLeft = (state) => {
  return ifElse(state, handleKeyArrowLeftMenuOpen, handleKeyArrowLeftMenuClosed)
}

const handleKeyArrowUpMenuOpen = (state) => {
  const { menus } = state
  const menu = menus.at(-1)
  const previousIndex = Menu.getIndexToFocusPrevious(menu)
  const newMenus = [
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

const handleKeyArrowUpMenuClosed = identity

export const handleKeyArrowUp = (state) => {
  return ifElse(state, handleKeyArrowUpMenuOpen, handleKeyArrowUpMenuClosed)
}

const handleKeyArrowRightMenuOpen = async (state) => {
  const { menus } = state
  // if menu can open sub menu to the right -> do that
  const menu = menus.at(-1)
  const { items, focusedIndex, left, top } = menu
  if (focusedIndex === -1) {
    return focusNext(state)
  }
  const item = items[focusedIndex]
  if (item.flags === MenuItemFlags.SubMenu) {
    console.log({ top, left })
    const subMenuEntries = await MenuEntries.getMenuEntries(item.id)
    const subMenu = {
      level: menus.length,
      items: subMenuEntries,
      focusedIndex: -1,
      top: top + focusedIndex * 25,
      left: left + Menu.MENU_WIDTH,
    }
    const newMenus = [...menus, subMenu]
    // TODO show sub menu
    // await Menu.showSubMenu(Menu.state.menus.length - 1, menu.focusedIndex)
    return {
      ...state,
      menus: newMenus,
    }
  }
}

const handleKeyArrowRightMenuClosed = focusNext

export const handleKeyArrowRight = (state) => {
  return ifElse(
    state,
    handleKeyArrowRightMenuOpen,
    handleKeyArrowRightMenuClosed
  )
}

const handleKeyHomeMenuOpen = (state) => {
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

const handleKeyHomeMenuClosed = focusFirst

export const handleKeyHome = (state) => {
  return ifElse(state, handleKeyHomeMenuOpen, handleKeyHomeMenuClosed)
}

const handleKeyEndMenuOpen = (state) => {
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

const handleKeyEndMenuClosed = focusLast

// TODO this is also use for pagedown -> maybe find a better name for this function
export const handleKeyEnd = (state) => {
  return ifElse(state, handleKeyEndMenuOpen, handleKeyEndMenuClosed)
}

const handleKeySpaceMenuOpen = (state) => {
  // TODO
  // await Menu.selectCurrent()
  return state
}

const handleKeySpaceMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}

// TODO this is same as handle key enter -> merge the functions
export const handleKeySpace = (state) => {
  return ifElse(state, handleKeySpaceMenuOpen, handleKeySpaceMenuClosed)
}

const handleKeyEnterMenuOpen = (state) => {
  // TODO
  // await Menu.selectCurrent()
  return state
}

const handleKeyEnterMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}

export const handleKeyEnter = (state) => {
  return ifElse(state, handleKeyEnterMenuOpen, handleKeyEnterMenuClosed)
}

const handleKeyEscapeMenuOpen = (state) => {
  return closeMenu(state, /* keepFocus */ true)
}

const handleKeyEscapeMenuClosed = identity

export const handleKeyEscape = (state) => {
  return ifElse(state, handleKeyEscapeMenuOpen, handleKeyEscapeMenuClosed)
}

const handleKeyArrowDownMenuOpen = (state) => {
  const { menus } = state
  const menu = menus[0]
  const newFocusedIndex = Menu.getIndexToFocusNext(menu)
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

const handleKeyArrowDownMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}

export const handleKeyArrowDown = (state) => {
  return ifElse(state, handleKeyArrowDownMenuOpen, handleKeyArrowDownMenuClosed)
}

export const handleMouseOver = (state, index) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return focusIndex(state, index)
  }
  return state
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
    return (
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.isMenuOpen === newState.isMenuOpen
    )
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
    return oldState.menus === newState.menus
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBarMenuBar',
      /* method */ 'setMenus',
      /* menus */ newState.menus,
    ]
  },
}

export const render = [renderTitleBarEntries, renderFocusedIndex, renderMenus]
