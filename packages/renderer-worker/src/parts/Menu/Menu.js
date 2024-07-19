import * as RendererProcess from '../RendererProcess/RendererProcess.js'
// TODO lazyload menuEntries and use Command.execute (maybe)
import * as ExecuteMenuItemCommand from '../ExecuteMenuItemCommand/ExecuteMenuItemCommand.js'
import * as GetMenuEntriesWithKeyBindings from '../GetMenuEntriesWithKeyBindings/GetMenuEntriesWithKeyBindings.js'
import * as GetMenuVirtualDom from '../GetMenuVirtualDom/GetMenuVirtualDom.js'
import * as GetVisibleMenuItems from '../GetVisibleMenuItems/GetVisibleMenuItems.js'
import * as Logger from '../Logger/Logger.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const state = {
  /**
   * @type {any[]}
   */
  menus: [],
  latestTimeStamp: 0,
  enterTimeout: -1,
}

export const MENU_WIDTH = 150

const CONTEXT_MENU_ITEM_HEIGHT = 26
const CONTEXT_MENU_SEPARATOR_HEIGHT = 11
const CONTEXT_MENU_PADDING = 8
const CONTEXT_MENU_WIDTH = 250

export const getMenuWidth = () => {
  return CONTEXT_MENU_WIDTH
}

export const getMenuHeight = (items) => {
  let height = CONTEXT_MENU_PADDING
  for (const item of items) {
    switch (item.flags) {
      case MenuItemFlags.Separator:
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
    Logger.warn('menu not available')
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
  const layoutState = ViewletStates.getState(ViewletModuleId.Layout)
  const windowWidth = layoutState.points[0]
  const windowHeight = layoutState.points[1]
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

export const show = async (x, y, id, mouseBlocking = false, ...args) => {
  const items = await GetMenuEntriesWithKeyBindings.getMenuEntriesWithKeyBindings(id, ...args)
  const bounds = getMenuBounds(x, y, items)
  const menu = addMenuInternal({
    id,
    items,
    focusedIndex: -1,
    level: state.menus.length,
    x: bounds.x,
    y: bounds.y,
  })
  const visible = GetVisibleMenuItems.getVisible(menu.items, -1, false, menu.level)
  const dom = GetMenuVirtualDom.getMenuVirtualDom(visible).slice(1)
  await RendererProcess.invoke(
    /* Menu.show */ 'Menu.showMenu',
    /* x */ bounds.x,
    /* y */ bounds.y,
    /* width */ bounds.width,
    /* height */ bounds.height,
    /* items */ menu.items,
    /* level */ menu.level,
    /* parentIndex */ -1,
    /* dom */ dom,
    /* mouseBlocking */ mouseBlocking,
  )
}

export const closeSubMenu = () => {
  // @ts-ignore
  const menu = state.menus.pop()
  const parentMenu = state.menus.at(-1)
  RendererProcess.invoke(/* Menu.hideSubMenu */ 7903, /* parentIndex */ parentMenu.focusedIndex)
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
  const visible = GetVisibleMenuItems.getVisible(subMenu.items, -1, false, subMenu.level)
  const dom = GetMenuVirtualDom.getMenuVirtualDom(visible).slice(1)
  RendererProcess.invoke(
    /* Menu.showMenu */ 'Menu.showMenu',
    /* x */ subMenu.x,
    /* y */ subMenu.y,
    /* width */ width,
    /* height */ height,
    /* items */ subMenu.items,
    /* level */ subMenu.level,
    /* parentIndex */ index,
    /* dom */ dom,
  )
}

export const showSubMenu = async (level, index) => {
  await showSubMenuAtEnter(level, index, -1, -1)
}

const selectIndexNone = async (menu, item, index) => {
  await Promise.all([hide(/* restoreFocus */ false), ExecuteMenuItemCommand.executeMenuItemCommand(item)])
}

const selectIndexRestoreFocus = async (menu, item, index) => {
  await Promise.all([hide(/* restoreFocus */ true), ExecuteMenuItemCommand.executeMenuItemCommand(item)])
}

const selectIndexSubMenu = async (menu, item, index) => {
  if (menu.focusedIndex === index) {
    return
  }
  await showSubMenu(menu.level, menu.focusedIndex)
}

const selectIndexDefault = (menu, item, index) => {}

const selectIndexIgnore = async (menu, item, index) => {
  await ExecuteMenuItemCommand.executeMenuItemCommand(item)
}

const getSelectIndexFunction = (flags) => {
  switch (flags) {
    case MenuItemFlags.None:
      return selectIndexNone
    case MenuItemFlags.SubMenu:
      return selectIndexSubMenu
    case MenuItemFlags.RestoreFocus:
      return selectIndexRestoreFocus
    case MenuItemFlags.Ignore:
      return selectIndexIgnore
    default:
      return selectIndexDefault
  }
}

export const selectIndex = async (level, index) => {
  const menu = state.menus[level]
  // TODO avoid assignment
  menu.focusedIndex = index
  const item = menu.items[menu.focusedIndex]
  const fn = getSelectIndexFunction(item.flags)
  fn(menu, item, index)
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

export const hide = async (restoreFocus = true) => {
  if (state.menus.length === 0) {
    return
  }
  state.menus = []
  await RendererProcess.invoke(/* Menu.hide */ 'Menu.hide', /* restoreFocus */ restoreFocus)
}

// TODO difference between focusing with mouse or keyboard
// with mouse -> open submenu
// with keyboard -> don't open submenu, only focus

const hideSubMenus = async (level) => {
  if (level < state.menus.length) {
    state.menus = state.menus.slice(0, level + 1)
    await RendererProcess.invoke(/* Menu.hideSubMenu */ 'Menu.hideSubMenu', /* level */ level + 1)
  }
}

const MENU_DELAY_TRIANGLE = 300

const resolveAfterTimeout = (fn) => {
  setTimeout(fn, MENU_DELAY_TRIANGLE)
}

export const handleMouseEnter = async (level, index, enterX, enterY, enterTimeStamp) => {
  state.latestTimeStamp = enterTimeStamp
  if (level >= state.menus.length) {
    return
  }
  const menu = state.menus[level]
  if (menu.focusedIndex === index) {
    return
  }
  if (level < state.menus.length - 1) {
    const subMenu = state.menus[level + 1]
    const subMenuEnterX = subMenu.enterX
    // TODO should check for triangle position here
    if (enterX >= subMenuEnterX) {
      await new Promise(resolveAfterTimeout)
      if (state.latestTimeStamp !== enterTimeStamp) {
        return
      }
    }
  }
  const item = menu.items[index]
  await focusIndex(menu, index)
  switch (item.flags) {
    case /* SubMenu */ 4:
      await showSubMenuAtEnter(menu.level, index, enterX, enterY)
      break
    default:
      await hideSubMenus(menu.level)
      break
  }
}

export const handleMouseLeave = async () => {
  const menu = state.menus[0]
  if (menu.items.length === 0) {
    return
  }
  const oldFocusedIndex = menu.focusedIndex
  menu.focusedIndex = -1
  await RendererProcess.invoke(
    /* Menu.focusIndex */ 'Menu.focusIndex',
    /* level */ menu.level,
    /* oldFocusedIndex */ oldFocusedIndex,
    /* newFocusedIndex */ -1,
  )
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
    /* newFocusedIndex */ index,
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
  return -1
}

export const getIndexToFocusFirst = (items) => {
  return getIndexToFocusNextStartingAt(items, 0)
}

export const focusFirst = async () => {
  const menu = getCurrentMenu()
  if (menu.items.length === 0) {
    return
  }
  const indexToFocus = getIndexToFocusFirst(menu.items)
  await focusIndex(menu, indexToFocus)
}

export const getIndexToFocusLast = (items) => {
  return getIndexToFocusPreviousStartingAt(items, items.length - 1)
}

export const focusLast = async () => {
  const menu = getCurrentMenu()
  const indexToFocus = getIndexToFocusPreviousStartingAt(menu.items, menu.items.length - 1)
  await focusIndex(menu, indexToFocus)
}

// TODO this code seems a bit too complicated, maybe it can be simplified
export const getIndexToFocusPreviousStartingAt = (items, startIndex) => {
  for (let i = startIndex; i > startIndex - items.length; i--) {
    const index = (i + items.length) % items.length
    const item = items[index]
    if (canBeFocused(item)) {
      return index
    }
  }
  return -1
}

export const getIndexToFocusPrevious = (menu) => {
  const startIndex = menu.focusedIndex === -1 ? menu.items.length - 1 : menu.focusedIndex - 1
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
  switch (item.flags) {
    case MenuItemFlags.Separator:
    case MenuItemFlags.Disabled:
      return false
    default:
      return true
  }
}

export const getIndexToFocusNext = (menu) => {
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

// TODO handle printable letter and focus item that starts with that letter

// TODO pageup / pagedown keys

// TODO more tests
