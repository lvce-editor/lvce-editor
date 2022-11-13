import * as TitleBarMenuBarEntries from '../TitleBarMenuBarEntries/TitleBarMenuBarEntries.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

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

export const hasFunctionalRender = true

const renderTitleBarEntries = {
  isEqual(oldState, newState) {
    return oldState.titleBarEntries === newState.titleBarEntries
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.TitleBarMenuBar,
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
      /* id */ ViewletModuleId.TitleBarMenuBar,
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
      /* id */ ViewletModuleId.TitleBarMenuBar,
      /* method */ 'setMenus',
      /* changes */ changes,
    ]
  },
}

export const render = [renderTitleBarEntries, renderFocusedIndex, renderMenus]
