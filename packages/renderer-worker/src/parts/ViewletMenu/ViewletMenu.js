import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Command from '../Command/Command.js'
// TODO lazyload menuEntries and use Command.execute (maybe)
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as Layout from '../Layout/Layout.js'
import { state } from '../Callback/Callback.js'

export const create = () => {
  return {
    items: [],
    x: 0,
    y: 0,
    id: '',
    width: 0,
    height: 0,
    focusedIndex: -1,
  }
}

const getDisplayItems = (items) => {
  const addId = (item, index) => {
    return {
      ...item,
      id: `MenuItem-${index}`,
    }
  }
  return items.map(addId)
}

export const loadContent = async (state, x, y, id) => {
  const items = await MenuEntries.getMenuEntries(id)
  const displayItems = getDisplayItems(items)
  const bounds = getMenuBounds(x, y, items)
  return {
    ...state,
    items: displayItems,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  }
}

const MENU_WIDTH = 150

const CONTEXT_MENU_ITEM_HEIGHT = 28
const CONTEXT_MENU_SEPARATOR_HEIGHT = 6
const CONTEXT_MENU_PADDING = 20
const CONTEXT_MENU_WIDTH = 250

export const getMenuWidth = () => {
  return CONTEXT_MENU_WIDTH
}

export const getMenuHeight = (items) => {
  let height = CONTEXT_MENU_PADDING
  for (const item of items) {
    switch (item.flags) {
      case /* ContextMenuItemSeparator */ 1:
        height += CONTEXT_MENU_SEPARATOR_HEIGHT
        break
      default:
        height += CONTEXT_MENU_ITEM_HEIGHT
        break
    }
  }
  return height
}

const getCurrentMenu = () => {
  if (state.menus.length === 0) {
    console.warn('menu not available')
  }
  return state.menus.at(-1)
}

export const addMenuInternal = (menu) => {
  if (state.menus.length > 5) {
    throw new Error('too many menus')
  }
  state.menus.push(menu)
  return menu
}

export const addRootMenuInternal = (menu) => {
  state.menus = [menu]
  return menu
}

const getMenuBounds = (x, y, items) => {
  const menuWidth = CONTEXT_MENU_WIDTH
  const menuHeight = getMenuHeight(items)

  const windowWidth = Layout.state.windowWidth
  const windowHeight = Layout.state.windowHeight
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?

  if (x + menuWidth > windowWidth) {
    x -= menuWidth
  }
  if (y + menuHeight > windowHeight) {
    y -= menuHeight
  }

  return {
    x,
    y,
    width: menuWidth,
    height: menuHeight,
  }
}

export const show = async (x, y, id, mouseBlocking = false) => {
  const items = await MenuEntries.getMenuEntries(id)
  const bounds = getMenuBounds(x, y, items)
  const menu = addMenuInternal({
    id,
    items,
    focusedIndex: -1,
    level: state.menus.length,
    x: bounds.x,
    y: bounds.y,
  })
  await RendererProcess.invoke(
    /* Menu.show */ 'Menu.showMenu',
    /* x */ bounds.x,
    /* y */ bounds.y,
    /* width */ bounds.width,
    /* height */ bounds.height,
    /* items */ menu.items,
    /* level */ menu.level,
    /* parentIndex */ -1,
    /* mouseBlocking */ mouseBlocking
  )
}

export const closeSubMenu = () => {
  const menu = state.menus.pop()
  const parentMenu = state.menus.at(-1)
  RendererProcess.invoke(
    /* Menu.hideSubMenu */ 7903,
    /* parentIndex */ parentMenu.focusedIndex
  )
}

const showSubMenuAtEnter = async (level, index, enterX, enterY) => {
  // TODO delete old menus
  state.menus = state.menus.slice(0, level + 1)
  const parentMenu = state.menus[level]
  const item = parentMenu.items[index]
  const subMenuItems = await MenuEntries.getMenuEntries(item.id)
  const subMenu = addMenuInternal({
    id: item.id,
    items: subMenuItems,
    focusedIndex: -1,
    level: state.menus.length,
    y: parentMenu.y + index * 25,
    x: parentMenu.x + MENU_WIDTH,
    enterX,
    enterY,
  })
  const width = getMenuWidth()
  const height = getMenuHeight(subMenuItems)
  RendererProcess.invoke(
    /* Menu.showMenu */ 'Menu.showMenu',
    /* x */ subMenu.x,
    /* y */ subMenu.y,
    /* width */ width,
    /* height */ height,
    /* items */ subMenu.items,
    /* level */ subMenu.level,
    /* parentIndex */ index
  )
}

export const showSubMenu = async (level, index) => {
  await showSubMenuAtEnter(level, index, -1, -1)
}

export const selectIndex = async (level, index) => {
  const menu = state.menus[level]
  menu.focusedIndex = index
  const item = menu.items[menu.focusedIndex]
  console.log('[menu] select index', item)
  switch (item.flags) {
    case /* None */ 0:
      if (!item.command) {
        console.warn('item has missing command', item)
        return
      }
      const args = item.args || []
      await Promise.all([hide(), Command.execute(item.command, ...args)])
      break
    case /* SubMenu */ 4:
      if (menu.focusedIndex === index) {
        return
      }
      await showSubMenu(menu.level, menu.focusedIndex)
      break
    default:
      break
  }
}

export const selectItem = (text) => {
  for (let level = 0; level < state.menus.length; level++) {
    const menu = state.menus[level]
    for (let i = 0; i < menu.items.length; i++) {
      const item = menu.items[i]
      if (item.label === text) {
        return selectIndex(level, i)
      }
    }
  }
  throw new Error(`menu item not found: ${text}`)
}

export const selectCurrent = async (level) => {
  const menu = state.menus[level]
  await selectIndex(level, menu.focusedIndex)
}

export const hide = async () => {
  if (state.menus.length === 0) {
    return
  }
  state.menus = []
  await RendererProcess.invoke(/* Menu.hide */ 'Menu.hide')
}

// TODO difference between focusing with mouse or keyboard
// with mouse -> open submenu
// with keyboard -> don't open submenu, only focus

const hideSubMenus = async (level) => {
  if (level < state.menus.length) {
    state.menus = state.menus.slice(0, level + 1)
    await RendererProcess.invoke(
      /* Menu.hideSubMenu */ 'Menu.hideSubMenu',
      /* level */ level + 1
    )
  }
}

const MENU_DELAY_TRIANGLE = 300

const resolveAfterTimeout = (fn) => {
  setTimeout(fn, MENU_DELAY_TRIANGLE)
}

export const handleMouseOver = async (state, index) => {
  console.log({ index })
  return {
    ...state,
    focusedIndex: index,
  }
}

export const focusIndex = async (menu, index) => {
  if (menu.items.length === 0) {
    return
  }
  const oldFocusedIndex = menu.focusedIndex
  menu.focusedIndex = index
  await RendererProcess.invoke(
    /* Menu.focusIndex */ 'Menu.focusIndex',
    /* level */ menu.level,
    /* oldFocusedIndex */ oldFocusedIndex,
    /* newFocusedIndex */ index
  )
}

export const getIndexToFocusNextStartingAt = (items, startIndex) => {
  for (let i = startIndex; i < startIndex + items.length; i++) {
    const index = i % items.length
    const item = items[index]
    if (canBeFocused(item)) {
      return index
    }
  }
  console.log({ startIndex, items })
  return -1
}

export const focusFirst = async () => {
  const menu = getCurrentMenu()
  if (menu.items.length === 0) {
    return
  }
  const indexToFocus = getIndexToFocusNextStartingAt(menu.items, 0)
  console.log({ first: indexToFocus })
  await focusIndex(menu, indexToFocus)
}

export const focusLast = async () => {
  const menu = getCurrentMenu()
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    menu.items,
    menu.items.length - 1
  )
  await focusIndex(menu, indexToFocus)
}

// TODO this code seems a bit too complicated, maybe it can be simplified
const getIndexToFocusPreviousStartingAt = (items, startIndex) => {
  for (let i = startIndex; i > startIndex - items.length; i--) {
    const index = (i + items.length) % items.length
    const item = items[index]
    if (canBeFocused(item)) {
      return index
    }
  }
  return -1
}

const getIndexToFocusPrevious = (menu) => {
  const startIndex =
    menu.focusedIndex === -1 ? menu.items.length - 1 : menu.focusedIndex - 1
  return getIndexToFocusPreviousStartingAt(menu.items, startIndex)
}

export const focusPrevious = async () => {
  const menu = getCurrentMenu()
  if (menu.items.length === 0) {
    return
  }
  const indexToFocus = getIndexToFocusPrevious(menu)
  await focusIndex(menu, indexToFocus)
}

const canBeFocused = (item) => {
  return item.flags !== /* Separator */ 1 && item.flags !== /* Disabled */ 5
}

const getIndexToFocusNext = (menu) => {
  const startIndex = menu.focusedIndex + 1
  return getIndexToFocusNextStartingAt(menu.items, startIndex)
}

export const focusNext = async () => {
  const menu = getCurrentMenu()
  if (menu.items.length === 0) {
    return
  }
  const indexToFocus = getIndexToFocusNext(menu)
  await focusIndex(menu, indexToFocus)
}

export const resetFocusedIndex = (menu) => {
  menu.focusedIndex = -1
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.items !== newState.items) {
    // TODO do more granular diffing here to send minimal dom changes to renderer-process
    changes.push([
      'Viewlet.send',
      'Menu',
      'setItems',
      /* items */ newState.items,
    ])
  }
  if (oldState.x !== newState.x || oldState.y !== newState.y) {
    changes.push([
      'Viewlet.send',
      'Menu',
      'setPosition',
      /* x */ newState.x,
      /* y */ newState.y,
    ])
  }
  if (oldState.focusedIndex !== newState.focusedIndex) {
    changes.push([
      'Viewlet.send',
      'Menu',
      'setFocusedIndex',
      /* oldIndex */ oldState.focusedIndex,
      /* newIndex */ newState.focusedIndex,
    ])
  }
  console.log({ changes })
  return changes
}

// TODO handle printable letter and focus item that starts with that letter

// TODO pageup / pagedown keys

// TODO more tests
