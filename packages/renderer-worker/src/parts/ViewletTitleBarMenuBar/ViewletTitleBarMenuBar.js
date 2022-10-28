import * as Command from '../Command/Command.js'
import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TitleBarMenuBarEntries from '../TitleBarMenuBarEntries/TitleBarMenuBarEntries.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.TitleBarMenuBar

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

const identity = (state) => {
  return state
}

const getIndexToFocusPreviousStartingAt = (items, index) => {
  return (index + items.length) % items.length
}

const closeOneMenu = (state) => {
  const { menus } = state
  const parentMenu = menus.at(-2)
  const newParentMenu = {
    ...parentMenu,
    expanded: false,
  }
  const newMenus = [...menus.slice(0, -2), newParentMenu]
  return {
    ...state,
    menus: newMenus,
  }
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
      /* oldIsMenuOpen */ oldState.isMenuOpen,
      /* newIsMenuOpen */ newState.isMenuOpen,
    ]
  },
}

const renderMenus = {
  isEqual(oldState, newState) {
    return oldState.menus === newState.menus
  },
  apply(oldState, newState) {
    const oldMenus = oldState.menus
    const newMenus = newState.menus
    const oldLength = oldMenus.length
    const newLength = newMenus.length
    const commonLength = Math.min(oldLength, newLength)
    const changes = []
    for (let i = 0; i < commonLength; i++) {
      const oldMenu = oldMenus[i]
      const newMenu = newMenus[i]
      if (oldMenu !== newMenu) {
        changes.push([
          /* method */ 'updateMenu',
          /* newMenu */ newMenu,
          /* newLength */ newLength,
        ])
      }
    }
    const difference = newLength - oldLength
    if (difference > 0) {
      changes.push(['addMenu', newMenus.at(-1)])
    } else if (difference < 0) {
      changes.push(['closeMenus', newLength])
    }
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBarMenuBar',
      /* method */ 'setMenus',
      /* changes */ changes,
    ]
  },
}

export const render = [renderTitleBarEntries, renderFocusedIndex, renderMenus]
